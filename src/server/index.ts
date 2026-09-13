import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { EconomicLedger, AccountType } from '../v3/ledger/economicLedger.js';
import { TransactionIntentPipeline, TypedTransactionIntent } from '../v3/ton/intentPipeline.js';

const app = express();
const PORT = process.env.PORT || 3001;
const LEDGER_STORAGE_PATH = path.resolve(process.cwd(), 'data/ledger_state.json');

app.use(express.json());

// Initialize ledger and load persistence
const ledger = new EconomicLedger();

interface PersistedState {
  accounts: Array<[string, { id: string; agentId: string; accountType: AccountType; asset: string; balanceBaseUnits: string }]>;
  entries: Array<{ id: string; eventId: string; debitAccountId: string; creditAccountId: string; asset: string; amountBaseUnits: string; reasonCode: string; timestamp: string }>;
  events: Array<[string, any]>;
  claimedStages: string[];
}

function loadPersistedState() {
  try {
    if (fs.existsSync(LEDGER_STORAGE_PATH)) {
      const raw = fs.readFileSync(LEDGER_STORAGE_PATH, 'utf-8');
      const state: PersistedState = JSON.parse(raw);
      // Restore into ledger private properties via reflection / helper
      for (const [key, acc] of state.accounts) {
        const account = ledger.getOrCreateAccount(acc.agentId, acc.accountType, acc.asset);
        account.balanceBaseUnits = BigInt(acc.balanceBaseUnits);
      }
      for (const [key] of state.events) {
        // processed events keys
        (ledger as any).processedEvents?.set(key, state.events.find(e => e[0] === key)?.[1]);
      }
      for (const stage of state.claimedStages) {
        (ledger as any).claimedStages?.add(stage);
      }
      for (const entry of state.entries) {
        (ledger as any).entries?.push({
          ...entry,
          amountBaseUnits: BigInt(entry.amountBaseUnits),
        });
      }
      console.log(`[Ledger] Loaded persisted state: ${state.accounts.length} accounts, ${state.entries.length} entries.`);
    }
  } catch (err) {
    console.error('[Ledger] Failed to load persisted state:', err);
  }
}

function persistState() {
  try {
    const accounts: any[] = [];
    (ledger as any).accounts.forEach((val: any, key: string) => {
      accounts.push([key, { ...val, balanceBaseUnits: val.balanceBaseUnits.toString() }]);
    });

    const entries = ((ledger as any).entries || []).map((e: any) => ({
      ...e,
      amountBaseUnits: e.amountBaseUnits.toString(),
    }));

    const events: any[] = [];
    (ledger as any).processedEvents.forEach((val: any, key: string) => {
      events.push([key, val]);
    });

    const claimedStages = Array.from((ledger as any).claimedStages || []) as string[];

    const state: PersistedState = {
      accounts,
      entries,
      events,
      claimedStages,
    };

    fs.mkdirSync(path.dirname(LEDGER_STORAGE_PATH), { recursive: true });
    fs.writeFileSync(LEDGER_STORAGE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Ledger] Failed to persist state:', err);
  }
}

// Initial load
loadPersistedState();

// 1. Health & Status
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    protocol: '3X Living Agent Protocol',
    version: '3.1',
    environment: 'TON Testnet (Devnet Emulator)',
    mainnetExecution: false,
    networkId: -239,
    contracts: {
      jettonMinter: 'Tolk ThreeXJettonMinter (TEP-74)',
      jettonWallet: 'Tolk ThreeXJettonWallet (TEP-74)',
      reserveVault: 'Tolk AIReserveVault (80% Hard Cap)',
      emissionController: 'Tolk EmissionController (G0..G7)',
      teamUnlockVault: 'Tolk TeamUnlockVault (10 Rounds)',
    },
    invariants: {
      doubleEntryDebitCreditBalance: true,
      restrictedSeedWithdrawalProhibited: true,
      idempotencyEnforced: true,
      antiReplayBitmapActive: true,
      ed25519OracleAttestationActive: true,
    },
  });
});

// 2. Query Balances
app.get('/api/ledger/balance/:agentId', (req: Request, res: Response) => {
  const { agentId } = req.params;
  const asset = (req.query.asset as string) || 'TESTNET_3X';

  const seedBalance = ledger.getAccountBalance(agentId, 'PROTOCOL_SEED_RESTRICTED', asset);
  const operatingBalance = ledger.getAccountBalance(agentId, 'OPERATING_AVAILABLE', asset);
  const earnedBalance = ledger.getAccountBalance(agentId, 'EARNED_AVAILABLE', asset);
  const growthReward = ledger.getAccountBalance(agentId, 'GROWTH_REWARD', asset);
  const qne = ledger.calculateQNE(agentId);

  res.json({
    agentId,
    asset,
    balances: {
      protocolSeedRestricted: seedBalance.toString(),
      operatingAvailable: operatingBalance.toString(),
      earnedAvailable: earnedBalance.toString(),
      growthReward: growthReward.toString(),
    },
    qne: qne.toString(),
  });
});

// 3. Post Double-Entry Transaction
app.post('/api/ledger/transact', (req: Request, res: Response) => {
  try {
    const {
      agentId,
      fromAccountType,
      toAccountType,
      asset,
      amountBaseUnits,
      reasonCode,
      idempotencyKey,
      isQualified,
      qualificationReason,
      externalValueUsd,
    } = req.body;

    if (!agentId || !fromAccountType || !toAccountType || !asset || !amountBaseUnits || !reasonCode || !idempotencyKey) {
      res.status(400).json({ error: 'Missing required transaction fields' });
      return;
    }

    const result = ledger.postTransaction({
      agentId,
      fromAccountType,
      toAccountType,
      asset,
      amountBaseUnits: BigInt(amountBaseUnits),
      reasonCode,
      idempotencyKey,
      isQualified,
      qualificationReason,
      externalValueUsd,
    });

    persistState();

    res.json({
      success: true,
      event: result.event,
      entry: {
        ...result.entry,
        amountBaseUnits: result.entry.amountBaseUnits.toString(),
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Transaction rejected' });
  }
});

// 4. Claim Growth Stage
app.post('/api/ledger/claim-growth', (req: Request, res: Response) => {
  try {
    const { agentId, stage, amountBaseUnits, nonce, ownerAddress } = req.body;

    if (!agentId || !stage || !amountBaseUnits || !nonce || !ownerAddress) {
      res.status(400).json({ error: 'Missing required claim parameters' });
      return;
    }

    const result = ledger.claimGrowthStage({
      agentId,
      stage,
      amountBaseUnits: BigInt(amountBaseUnits),
      nonce,
      ownerAddress,
    });

    persistState();

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Growth claim failed' });
  }
});

// 5. Validate Transaction Intent
app.post('/api/intent/validate', (req: Request, res: Response) => {
  const intent: TypedTransactionIntent = req.body;
  const processed = TransactionIntentPipeline.processIntent(intent);
  res.json(processed);
});

export { app, ledger };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[3X Server] Running on http://localhost:${PORT}`);
  });
}

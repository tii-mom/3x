export interface AgenticWalletConfig {
  network: 'testnet';
  ownerAddress: string;
  agenticWalletAddress?: string;
  operatorKeyRef: string; // Identifier reference to KMS/HSM slot, NEVER the private key
  status: 'UNINITIALIZED' | 'DEPLOYING' | 'ACTIVE' | 'REVOKED' | 'PAUSED';
  createdAt: string;
}

export interface ActivationPayload {
  network: 'testnet';
  action: 'DEPLOY_AGENTIC_SUBWALLET';
  ownerAddress: string;
  networkFeeTon: string;
  subwalletCodeHash: string;
  revocationGuaranteed: boolean;
}

export class AgenticWalletManager {
  public static prepareActivation(ownerAddress: string): ActivationPayload {
    if (!ownerAddress.startsWith('EQ') && !ownerAddress.startsWith('kQ')) {
      throw new Error('Invalid TON Testnet address format');
    }

    return {
      network: 'testnet',
      action: 'DEPLOY_AGENTIC_SUBWALLET',
      ownerAddress,
      networkFeeTon: '0.045',
      subwalletCodeHash: 'b9e782a1c0d4e3f5...subwallet_v1',
      revocationGuaranteed: true,
    };
  }

  public static activate(ownerAddress: string, txHash: string): AgenticWalletConfig {
    if (!txHash) {
      throw new Error('Transaction hash is required for testnet activation confirmation');
    }

    return {
      network: 'testnet',
      ownerAddress,
      agenticWalletAddress: `kQ_${ownerAddress.slice(2, 10)}_agentic`,
      operatorKeyRef: `kms_slot_ref_${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  public static revoke(wallet: AgenticWalletConfig): AgenticWalletConfig {
    return {
      ...wallet,
      status: 'REVOKED',
      agenticWalletAddress: undefined,
    };
  }
}

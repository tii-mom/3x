import { AgentState } from '../models/types';

export const VALID_AGENT_TRANSITIONS: Record<AgentState, AgentState[]> = {
  READY: ['EVALUATING', 'PAUSED', 'EVOLVING'],
  EVALUATING: ['WORKING', 'READY', 'PAUSED'],
  WORKING: ['SETTLING', 'PAUSED'],
  SETTLING: ['READY', 'EVOLVING', 'PAUSED'],
  PAUSED: ['READY', 'WORKING'],
  EVOLVING: ['READY'],
};

export class AgentStateMachine {
  private currentState: AgentState;

  constructor(initialState: AgentState = 'READY') {
    this.currentState = initialState;
  }

  public getState(): AgentState {
    return this.currentState;
  }

  public canTransition(targetState: AgentState): boolean {
    const allowed = VALID_AGENT_TRANSITIONS[this.currentState] || [];
    return allowed.includes(targetState);
  }

  public transitionTo(targetState: AgentState, reason?: string): AgentState {
    if (!this.canTransition(targetState)) {
      throw new Error(
        `Invalid agent state transition: cannot transition from ${this.currentState} to ${targetState}. Reason: ${reason || 'Unspecified'}`
      );
    }
    this.currentState = targetState;
    return this.currentState;
  }
}

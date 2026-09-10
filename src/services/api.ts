// Centralized configuration flag for mock API
export const USE_MOCK_API = (import.meta as any).env?.VITE_USE_MOCK_API !== 'false';

// Simulated delay helper for realistic UI state transitions
export const simulateNetworkDelay = async <T>(data: T, ms = 250): Promise<T> => {
  if (ms > 0) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
  return data;
};

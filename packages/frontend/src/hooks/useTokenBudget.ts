import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface BudgetStatus {
  used: number;
  remaining: number;
  total: number;
  percentage: number;
  health: 'green' | 'yellow' | 'red';
  memoryCount: number;
  surgeryRequired: boolean;
}

/**
 * useTokenBudget — Custom hook for tracking real-time token budget.
 * Polls the budget endpoint and provides health indicators.
 */
export function useTokenBudget(pollIntervalMs = 10000) {
  const [budget, setBudget] = useState<BudgetStatus>({
    used: 0,
    remaining: 128000,
    total: 128000,
    percentage: 0,
    health: 'green',
    memoryCount: 0,
    surgeryRequired: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchBudget = useCallback(async () => {
    try {
      const response = await api.get('/api/budget/status');
      setBudget(response.data);
    } catch (error) {
      console.error('Failed to fetch token budget:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudget();
    const interval = setInterval(fetchBudget, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchBudget, pollIntervalMs]);

  return { budget, loading, refresh: fetchBudget };
}

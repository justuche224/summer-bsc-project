"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  getAlerts,
  markAlertAsRead,
  clearAlert,
} from "@/app/actions";
import type { Transaction, Budget, Goal } from "./types";

// Query keys
const QUERY_KEYS = {
  transactions: ["transactions"] as const,
  budgets: ["budgets"] as const,
  goals: ["goals"] as const,
  alerts: ["alerts"] as const,
};

// Transactions hooks
export function useTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.transactions,
    queryFn: getTransactions,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });
}

// Budgets hooks
export function useBudgets() {
  return useQuery({
    queryKey: QUERY_KEYS.budgets,
    queryFn: getBudgets,
  });
}

export function useAddBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.budgets });
    },
  });
}

// Goals hooks
export function useGoals() {
  return useQuery({
    queryKey: QUERY_KEYS.goals,
    queryFn: getGoals,
  });
}

export function useAddGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) =>
      updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.goals });
    },
  });
}

// Alerts hooks
export function useAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.alerts,
    queryFn: getAlerts,
  });
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAlertAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

export function useClearAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.alerts });
    },
  });
}

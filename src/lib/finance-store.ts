"use client";

import { create } from "zustand";

interface UIState {
  isTransactionDialogOpen: boolean;
  isBudgetDialogOpen: boolean;
  isGoalDialogOpen: boolean;
  editingTransaction: string | null;
  editingBudget: string | null;
  editingGoal: string | null;
  setTransactionDialogOpen: (open: boolean) => void;
  setBudgetDialogOpen: (open: boolean) => void;
  setGoalDialogOpen: (open: boolean) => void;
  setEditingTransaction: (id: string | null) => void;
  setEditingBudget: (id: string | null) => void;
  setEditingGoal: (id: string | null) => void;
}

export const useFinanceStore = create<UIState>((set) => ({
  isTransactionDialogOpen: false,
  isBudgetDialogOpen: false,
  isGoalDialogOpen: false,
  editingTransaction: null,
  editingBudget: null,
  editingGoal: null,
  setTransactionDialogOpen: (open) => set({ isTransactionDialogOpen: open }),
  setBudgetDialogOpen: (open) => set({ isBudgetDialogOpen: open }),
  setGoalDialogOpen: (open) => set({ isGoalDialogOpen: open }),
  setEditingTransaction: (id) => set({ editingTransaction: id }),
  setEditingBudget: (id) => set({ editingBudget: id }),
  setEditingGoal: (id) => set({ editingGoal: id }),
}));

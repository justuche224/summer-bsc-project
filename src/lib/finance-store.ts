"use client"

import { create } from "zustand"
import type { Transaction, Budget, Goal, Alert } from "./types"

interface FinanceState {
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  alerts: Alert[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addBudget: (budget: Omit<Budget, "id" | "spent">) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  addGoal: (goal: Omit<Goal, "id">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  markAlertAsRead: (id: string) => void
  clearAlert: (id: string) => void
}

// Sample data for demo
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 250000,
    category: "Salary",
    description: "Monthly salary",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    type: "expense",
    amount: 45000,
    category: "Rent",
    description: "Monthly rent payment",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    type: "expense",
    amount: 12500,
    category: "Food",
    description: "Groceries",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    type: "expense",
    amount: 8000,
    category: "Transport",
    description: "Fuel",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const sampleBudgets: Budget[] = [
  { id: "1", category: "Food", limit: 50000, spent: 12500, period: "monthly" },
  { id: "2", category: "Transport", limit: 30000, spent: 8000, period: "monthly" },
  { id: "3", category: "Entertainment", limit: 20000, spent: 0, period: "monthly" },
]

const sampleGoals: Goal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 500000,
    currentAmount: 150000,
    deadline: "2025-12-31",
    category: "Savings",
  },
  {
    id: "2",
    name: "New Laptop",
    targetAmount: 300000,
    currentAmount: 75000,
    deadline: "2025-08-31",
    category: "Technology",
  },
]

const sampleAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "info",
    message: "Welcome to Finance Manager! Start by adding your first transaction.",
    timestamp: new Date().toISOString(),
    read: false,
  },
]

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: sampleTransactions,
  budgets: sampleBudgets,
  goals: sampleGoals,
  alerts: sampleAlerts,

  addTransaction: (transaction) =>
    set((state) => {
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
      }

      // Update budget spent amount
      const updatedBudgets = state.budgets.map((budget) =>
        budget.category === transaction.category && transaction.type === "expense"
          ? { ...budget, spent: budget.spent + transaction.amount }
          : budget,
      )

      // Check for budget alerts
      const newAlerts: Alert[] = []
      updatedBudgets.forEach((budget) => {
        const percentage = (budget.spent / budget.limit) * 100
        if (percentage >= 90 && percentage < 100) {
          newAlerts.push({
            id: `alert-${Date.now()}-${budget.id}`,
            type: "warning",
            message: `You've spent ${percentage.toFixed(0)}% of your ${budget.category} budget`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        } else if (percentage >= 100) {
          newAlerts.push({
            id: `alert-${Date.now()}-${budget.id}`,
            type: "warning",
            message: `You've exceeded your ${budget.category} budget by ₦${(budget.spent - budget.limit).toLocaleString()}`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        }
      })

      state.goals.forEach((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100
        if (progress >= 50 && progress < 75) {
          newAlerts.push({
            id: `alert-goal-${Date.now()}-${goal.id}`,
            type: "info",
            message: `You're halfway to your "${goal.name}" goal! Keep it up!`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        } else if (progress >= 100) {
          newAlerts.push({
            id: `alert-goal-${Date.now()}-${goal.id}`,
            type: "success",
            message: `Congratulations! You've achieved your "${goal.name}" goal!`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        }
      })

      return {
        transactions: [newTransaction, ...state.transactions],
        budgets: updatedBudgets,
        alerts: [...newAlerts, ...state.alerts],
      }
    }),

  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...transaction } : t)),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, { ...budget, id: Date.now().toString(), spent: 0 }],
    })),

  updateBudget: (id, budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
    })),

  deleteBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, { ...goal, id: Date.now().toString() }],
    })),

  updateGoal: (id, goal) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
    })),

  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),

  markAlertAsRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    })),

  clearAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),
}))

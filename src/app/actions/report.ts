"use server";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { transactions, budgets, goals } from "@/db/schema/finance";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";

export async function getReportData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [userTransactions, userBudgets, userGoals] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, session.user.id))
      .orderBy(desc(transactions.date)),
    db.select().from(budgets).where(eq(budgets.userId, session.user.id)),
    db.select().from(goals).where(eq(goals.userId, session.user.id)),
  ]);

  const transactionsData = userTransactions.map((t) => ({
    id: t.id,
    type: t.type as "income" | "expense",
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date.toISOString(),
  }));

  const budgetsData = userBudgets.map((b) => ({
    id: b.id,
    category: b.category,
    limit: b.limit,
    spent: b.spent,
    period: b.period as "monthly" | "weekly",
  }));

  const goalsData = userGoals.map((g) => ({
    id: g.id,
    name: g.name,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    deadline: g.deadline.toISOString().split("T")[0],
    category: g.category,
  }));

  const totalIncome = transactionsData
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactionsData
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = transactionsData
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
    transactions: transactionsData,
    budgets: budgetsData,
    goals: goalsData,
    summary: {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      transactionCount: transactionsData.length,
    },
    categoryBreakdown,
  };
}

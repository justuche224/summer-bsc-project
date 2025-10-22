"use server";

import { db } from "@/db";
import { auth } from "@/lib/auth";
import { transactions, budgets, goals, alerts } from "@/db/schema/finance";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Transaction, Budget, Goal, Alert } from "@/lib/types";
import { headers } from "next/headers";

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.date));

  return result.map((t) => ({
    id: t.id,
    type: t.type as "income" | "expense",
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date.toISOString(),
  }));
}

export async function addTransaction(data: Omit<Transaction, "id">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [transaction] = await db
    .insert(transactions)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
    })
    .returning();

  // Update budget spent amount if it's an expense
  if (data.type === "expense") {
    const budgetToUpdate = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.category, data.category),
          eq(budgets.userId, session.user.id)
        )
      )
      .limit(1);

    if (budgetToUpdate.length > 0) {
      await db
        .update(budgets)
        .set({ spent: budgetToUpdate[0].spent + data.amount })
        .where(
          and(
            eq(budgets.category, data.category),
            eq(budgets.userId, session.user.id)
          )
        );
    }
  }

  revalidatePath("/dashboard");
  return transaction;
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(transactions)
    .set({
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      updatedAt: new Date(),
    })
    .where(
      and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
    );

  revalidatePath("/dashboard");
}

export async function deleteTransaction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(transactions)
    .where(
      and(eq(transactions.id, id), eq(transactions.userId, session.user.id))
    );

  revalidatePath("/dashboard");
}

// Budgets
export async function getBudgets(): Promise<Budget[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, session.user.id));

  return result.map((b) => ({
    id: b.id,
    category: b.category,
    limit: b.limit,
    spent: b.spent,
    period: b.period as "monthly" | "weekly",
  }));
}

export async function addBudget(data: Omit<Budget, "id" | "spent">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [budget] = await db
    .insert(budgets)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      category: data.category,
      limit: data.limit,
      spent: 0,
      period: data.period,
    })
    .returning();

  revalidatePath("/dashboard");
  return budget;
}

export async function updateBudget(id: string, data: Partial<Budget>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(budgets)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(budgets.id, id), eq(budgets.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function deleteBudget(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(budgets)
    .where(and(eq(budgets.id, id), eq(budgets.userId, session.user.id)));

  revalidatePath("/dashboard");
}

// Goals
export async function getGoals(): Promise<Goal[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, session.user.id));

  return result.map((g) => ({
    id: g.id,
    name: g.name,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    deadline: g.deadline.toISOString().split("T")[0],
    category: g.category,
  }));
}

export async function addGoal(data: Omit<Goal, "id">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [goal] = await db
    .insert(goals)
    .values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      deadline: new Date(data.deadline),
      category: data.category,
    })
    .returning();

  revalidatePath("/dashboard");
  return goal;
}

export async function updateGoal(id: string, data: Partial<Goal>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(goals)
    .set({
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, id), eq(goals.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function deleteGoal(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(goals)
    .where(and(eq(goals.id, id), eq(goals.userId, session.user.id)));

  revalidatePath("/dashboard");
}

// Alerts
export async function getAlerts(): Promise<Alert[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(alerts)
    .where(eq(alerts.userId, session.user.id))
    .orderBy(desc(alerts.timestamp));

  return result.map((a) => ({
    id: a.id,
    type: a.type as "warning" | "info" | "success",
    message: a.message,
    timestamp: a.timestamp.toISOString(),
    read: a.read,
  }));
}

export async function markAlertAsRead(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(alerts)
    .set({ read: true, updatedAt: new Date() })
    .where(and(eq(alerts.id, id), eq(alerts.userId, session.user.id)));

  revalidatePath("/dashboard");
}

export async function clearAlert(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(alerts)
    .where(and(eq(alerts.id, id), eq(alerts.userId, session.user.id)));

  revalidatePath("/dashboard");
}

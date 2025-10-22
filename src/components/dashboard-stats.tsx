"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, WalletIcon } from "lucide-react";
import { useTransactions } from "@/lib/finance-queries";

export function DashboardStats() {
  const { data: transactions = [] } = useTransactions();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const stats = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: ArrowUpIcon,
      trend: "+12.5%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: ArrowDownIcon,
      trend: "+8.2%",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Balance",
      value: balance,
      icon: WalletIcon,
      trend: balance > 0 ? "Positive" : "Negative",
      color: balance > 0 ? "text-primary" : "text-destructive",
      bgColor: balance > 0 ? "bg-primary/10" : "bg-destructive/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{stat.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.trend} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

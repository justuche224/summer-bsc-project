"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinanceStore } from "@/lib/finance-store"
import { TrendingUpIcon, TrendingDownIcon, PiggyBankIcon, CalendarIcon } from "lucide-react"

export function FinancialSummary() {
  const transactions = useFinanceStore((state) => state.transactions)
  const budgets = useFinanceStore((state) => state.budgets)
  const goals = useFinanceStore((state) => state.goals)

  // Calculate monthly stats
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const monthlyExpenses = monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0

  // Calculate average daily spending
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const avgDailySpending = monthlyExpenses / daysInMonth

  // Budget adherence
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const budgetAdherence = totalBudgetLimit > 0 ? ((totalBudgetLimit - totalBudgetSpent) / totalBudgetLimit) * 100 : 0

  // Goals progress
  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalGoalsCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const goalsProgress = totalGoalsTarget > 0 ? (totalGoalsCurrent / totalGoalsTarget) * 100 : 0

  const summaryStats = [
    {
      title: "Monthly Income",
      value: `₦${monthlyIncome.toLocaleString()}`,
      icon: TrendingUpIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Monthly Expenses",
      value: `₦${monthlyExpenses.toLocaleString()}`,
      icon: TrendingDownIcon,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBankIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Avg Daily Spending",
      value: `₦${avgDailySpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: CalendarIcon,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.title} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-2 ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <span className="font-semibold">₦{totalBudgetLimit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Spent</span>
                <span className="font-semibold">₦{totalBudgetSpent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-semibold text-primary">
                  ₦{(totalBudgetLimit - totalBudgetSpent).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adherence Rate</span>
                  <span
                    className={`font-bold ${budgetAdherence > 50 ? "text-primary" : budgetAdherence > 20 ? "text-accent" : "text-destructive"}`}
                  >
                    {budgetAdherence.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Target</span>
                <span className="font-semibold">₦{totalGoalsTarget.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saved</span>
                <span className="font-semibold">₦{totalGoalsCurrent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="font-semibold text-primary">
                  ₦{(totalGoalsTarget - totalGoalsCurrent).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="font-bold text-primary">{goalsProgress.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

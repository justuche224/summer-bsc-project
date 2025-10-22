"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinanceStore } from "@/lib/finance-store"

export function SpendingTrends() {
  const transactions = useFinanceStore((state) => state.transactions)

  // Get last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  // Group by week
  const weeklyData = []
  for (let i = 0; i < 4; i++) {
    const weekStart = i * 7
    const weekEnd = weekStart + 7
    const weekDays = last30Days.slice(weekStart, weekEnd)

    const weekTransactions = transactions.filter((t) => {
      const tDate = t.date.split("T")[0]
      return weekDays.includes(tDate)
    })

    const income = weekTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = weekTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    weeklyData.push({
      week: `Week ${i + 1}`,
      income: income / 1000,
      expenses: expenses / 1000,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <XAxis
              dataKey="week"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₦${value}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`₦${value}k`, ""]}
            />
            <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

import { DashboardStats } from "@/components/dashboard-stats";
// import { RecentTransactions } from "@/components/recent-transactions";
import { GoalsOverview } from "@/components/goals-overview";
import { SpendingChart } from "@/components/spending-chart";
import { TransactionsList } from "@/components/transactions-list";
import { BudgetsList } from "@/components/budgets-list";
import { GoalsList } from "@/components/goals-list";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { SpendingTrends } from "@/components/spending-trends";
import { FinancialSummary } from "@/components/financial-summary";
// import { AlertsPanel } from "@/components/alerts-panel";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <DashboardStats />

        {/* Transactions */}
        <TransactionsList />

        {/* Alerts Panel */}
        {/* <AlertsPanel /> */}

        {/* Charts and Overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SpendingChart />
          <GoalsOverview />
        </div>

        {/* Financial Summary & Analytics */}
        <FinancialSummary />

        {/* Reports */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryBreakdown />
          <SpendingTrends />
        </div>

        {/* Budgets and Goals Management */}
        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetsList />
          <GoalsList />
        </div>

        {/* Recent Transactions */}
        {/* <RecentTransactions /> */}
      </div>
    </div>
  );
}

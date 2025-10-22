"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useBudgets, useDeleteBudget } from "@/lib/finance-queries";
import { EditIcon, TrashIcon, TrendingUpIcon } from "lucide-react";
import { BudgetDialog } from "./budget-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function BudgetsList() {
  const { data: budgets = [], isLoading } = useBudgets();
  const deleteBudgetMutation = useDeleteBudget();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="h-5 w-5" />
          Budgets
        </CardTitle>
        <BudgetDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No budgets set yet</p>
              <p className="text-sm mt-1">
                Create a budget to track your spending
              </p>
            </div>
          ) : (
            budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage >= 100;
              const isNearLimit = percentage >= 80 && percentage < 100;

              return (
                <div
                  key={budget.id}
                  className="space-y-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{budget.category}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {budget.period}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <BudgetDialog
                        budget={budget}
                        trigger={
                          <Button variant="ghost" size="icon">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this budget? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deleteBudgetMutation.mutate(budget.id)
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">
                        ₦{budget.spent.toLocaleString()} / ₦
                        {budget.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${
                        isOverBudget
                          ? "[&>div]:bg-destructive"
                          : isNearLimit
                          ? "[&>div]:bg-accent"
                          : ""
                      }`}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          isOverBudget
                            ? "text-destructive"
                            : isNearLimit
                            ? "text-accent"
                            : "text-muted-foreground"
                        }`}
                      >
                        {percentage.toFixed(0)}% used
                      </span>
                      <span className="text-muted-foreground">
                        ₦{(budget.limit - budget.spent).toLocaleString()}{" "}
                        remaining
                      </span>
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                      Over budget by ₦
                      {(budget.spent - budget.limit).toLocaleString()}
                    </div>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <div className="text-xs text-accent bg-accent/10 p-2 rounded">
                      Approaching budget limit - {(100 - percentage).toFixed(0)}
                      % remaining
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFinanceStore } from "@/lib/finance-store";
import { useGoals, useDeleteGoal } from "@/lib/finance-queries";
import { EditIcon, TrashIcon, TargetIcon } from "lucide-react";
import { GoalDialog } from "./goal-dialog";
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

export function GoalsList() {
  const { data: goals = [], isLoading } = useGoals();
  const deleteGoalMutation = useDeleteGoal();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TargetIcon className="h-5 w-5" />
          Financial Goals
        </CardTitle>
        <GoalDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No goals set yet</p>
              <p className="text-sm mt-1">Create a goal to start saving</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
              const isCompleted = progress >= 100;
              const isOverdue = daysLeft < 0;

              return (
                <div
                  key={goal.id}
                  className="space-y-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg">{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <GoalDialog
                        goal={goal}
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
                            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this goal? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteGoalMutation.mutate(goal.id)}
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
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        ₦{goal.currentAmount.toLocaleString()} / ₦
                        {goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          isCompleted ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {progress.toFixed(0)}% complete
                      </span>
                      <span
                        className={
                          isOverdue
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {isOverdue
                          ? `${Math.abs(daysLeft)} days overdue`
                          : daysLeft === 0
                          ? "Due today"
                          : `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="text-xs text-primary bg-primary/10 p-2 rounded">
                      Goal achieved! Congratulations!
                    </div>
                  )}
                  {!isCompleted && (
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      ₦
                      {(
                        goal.targetAmount - goal.currentAmount
                      ).toLocaleString()}{" "}
                      remaining to reach your goal
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

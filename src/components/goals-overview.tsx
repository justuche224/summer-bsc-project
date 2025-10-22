"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGoals } from "@/lib/finance-queries";
import { TargetIcon } from "lucide-react";

export function GoalsOverview() {
  const { data: goals = [] } = useGoals();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TargetIcon className="h-5 w-5" />
          Financial Goals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {daysLeft} days left
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₦{goal.currentAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      of ₦{goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {progress.toFixed(0)}% complete
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

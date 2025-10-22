"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddBudget, useUpdateBudget } from "@/lib/finance-queries";
import { PlusIcon } from "lucide-react";
import type { Budget } from "@/lib/types";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Other",
];

interface BudgetDialogProps {
  budget?: Budget;
  trigger?: React.ReactNode;
}

export function BudgetDialog({ budget, trigger }: BudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const addBudgetMutation = useAddBudget();
  const updateBudgetMutation = useUpdateBudget();

  const [formData, setFormData] = useState({
    category: budget?.category || "",
    limit: budget?.limit.toString() || "",
    period: budget?.period || ("monthly" as "monthly" | "weekly"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.limit) {
      return;
    }

    const budgetData = {
      category: formData.category,
      limit: Number.parseFloat(formData.limit),
      period: formData.period,
    };

    if (budget) {
      updateBudgetMutation.mutate({ id: budget.id, data: budgetData });
    } else {
      addBudgetMutation.mutate(budgetData);
    }

    setOpen(false);
    setFormData({
      category: "",
      limit: "",
      period: "monthly",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {budget ? "Edit Budget" : "Create New Budget"}
          </DialogTitle>
          <DialogDescription>
            {budget
              ? "Update your budget details below."
              : "Set a spending limit for a category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="limit">Budget Limit (₦)</Label>
              <Input
                id="limit"
                type="number"
                placeholder="0.00"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period}
                onValueChange={(value: "monthly" | "weekly") =>
                  setFormData({ ...formData, period: value })
                }
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{budget ? "Update" : "Create"} Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

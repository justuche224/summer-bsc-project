"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFinanceStore } from "@/lib/finance-store"
import { PlusIcon } from "lucide-react"
import type { Goal } from "@/lib/types"

interface GoalDialogProps {
  goal?: Goal
  trigger?: React.ReactNode
}

export function GoalDialog({ goal, trigger }: GoalDialogProps) {
  const [open, setOpen] = useState(false)
  const addGoal = useFinanceStore((state) => state.addGoal)
  const updateGoal = useFinanceStore((state) => state.updateGoal)

  const [formData, setFormData] = useState({
    name: goal?.name || "",
    targetAmount: goal?.targetAmount.toString() || "",
    currentAmount: goal?.currentAmount.toString() || "0",
    deadline: goal?.deadline.split("T")[0] || "",
    category: goal?.category || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.targetAmount || !formData.deadline || !formData.category) {
      return
    }

    const goalData = {
      name: formData.name,
      targetAmount: Number.parseFloat(formData.targetAmount),
      currentAmount: Number.parseFloat(formData.currentAmount),
      deadline: new Date(formData.deadline).toISOString(),
      category: formData.category,
    }

    if (goal) {
      updateGoal(goal.id, goalData)
    } else {
      addGoal(goalData)
    }

    setOpen(false)
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      category: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            {goal ? "Update your financial goal details." : "Set a savings target and track your progress."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Emergency Fund, New Laptop"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Savings, Technology"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target Amount (₦)</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentAmount">Current Amount (₦)</Label>
              <Input
                id="currentAmount"
                type="number"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Target Date</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{goal ? "Update" : "Create"} Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions, useDeleteTransaction } from "@/lib/finance-queries";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
} from "lucide-react";
import { TransactionDialog } from "./transaction-dialog";
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

export function TransactionsList() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteTransactionMutation = useDeleteTransaction();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [filterCategory, setFilterCategory] = useState("all");

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(value: "all" | "income" | "expense") =>
              setFilterType(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {/* Mobile-first layout */}
                <div className="flex items-start gap-3">
                  {/* Transaction type icon */}
                  <div
                    className={`rounded-full p-2 flex-shrink-0 ${
                      transaction.type === "income"
                        ? "bg-primary/10"
                        : "bg-destructive/10"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-destructive" />
                    )}
                  </div>

                  {/* Main content area */}
                  <div className="flex-1 min-w-0">
                    {/* Transaction name and amount row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm sm:text-base truncate pr-2">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p
                          className={`font-semibold text-sm sm:text-base whitespace-nowrap ${
                            transaction.type === "income"
                              ? "text-primary"
                              : "text-destructive"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₦
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Category, date, and actions row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className="text-xs flex-shrink-0"
                        >
                          {transaction.category}
                        </Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                          <span className="sm:hidden">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-NG",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="hidden sm:inline">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-NG",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <TransactionDialog
                          transaction={transaction}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <EditIcon className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Transaction
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this
                                transaction? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteTransactionMutation.mutate(
                                    transaction.id
                                  )
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

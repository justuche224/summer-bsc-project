import { AlertsDropdown } from "@/components/alerts-dropdown";
import { ModeToggle } from "@/components/mode-toggle";
import { TransactionDialog } from "@/components/transaction-dialog";
import UserMenu from "@/components/user-menu";
import { WalletIcon } from "lucide-react";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="bg-sidebar/50 backdrop-blur-md sticky top-0 left-0 right-0 z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between container mx-auto p-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-xl bg-primary p-2">
                <WalletIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Management finance
              </h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track your income, expenses, and achieve your financial goals
            </p>
          </div>
          <div className="flex items-center gap-3 max-sm:justify-between">
            <TransactionDialog />
            <AlertsDropdown />
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default layout;

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFinanceStore } from "@/lib/finance-store";
import {
  useAlerts,
  useMarkAlertAsRead,
  useClearAlert,
} from "@/lib/finance-queries";
import {
  BellIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AlertsDropdown() {
  const { data: alerts = [] } = useAlerts();
  const markAlertAsReadMutation = useMarkAlertAsRead();
  const clearAlertMutation = useClearAlert();

  const unreadCount = alerts.filter((a) => !a.read).length;
  const recentAlerts = alerts.slice(0, 5);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangleIcon;
      case "success":
        return CheckCircleIcon;
      default:
        return InfoIcon;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-accent";
      case "success":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No notifications</p>
            </div>
          ) : (
            recentAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              const color = getAlertColor(alert.type);

              return (
                <DropdownMenuItem
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${
                    alert.read ? "opacity-60" : ""
                  }`}
                  onClick={() => {
                    if (!alert.read) {
                      markAlertAsReadMutation.mutate(alert.id);
                    }
                  }}
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-relaxed">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString("en-NG", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>
        {alerts.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-sm text-primary">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

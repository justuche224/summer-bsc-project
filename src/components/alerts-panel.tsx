"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFinanceStore } from "@/lib/finance-store"
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XIcon, BellIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AlertsPanel() {
  const alerts = useFinanceStore((state) => state.alerts)
  const markAlertAsRead = useFinanceStore((state) => state.markAlertAsRead)
  const clearAlert = useFinanceStore((state) => state.clearAlert)

  const unreadCount = alerts.filter((a) => !a.read).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangleIcon
      case "success":
        return CheckCircleIcon
      default:
        return InfoIcon
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: "text-accent",
          bg: "bg-accent/10",
          border: "border-accent/20",
        }
      case "success":
        return {
          icon: "text-primary",
          bg: "bg-primary/10",
          border: "border-primary/20",
        }
      default:
        return {
          icon: "text-muted-foreground",
          bg: "bg-muted",
          border: "border-border",
        }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5" />
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No notifications</p>
              <p className="text-sm mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type)
                const colors = getAlertColor(alert.type)

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${colors.bg} ${colors.border} ${alert.read ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${colors.bg}`}>
                        <Icon className={`h-4 w-4 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString("en-NG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!alert.read && (
                          <Button variant="ghost" size="sm" onClick={() => markAlertAsRead(alert.id)}>
                            Mark read
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => clearAlert(alert.id)}>
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

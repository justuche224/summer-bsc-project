export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly"
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export interface Alert {
  id: string
  type: "warning" | "info" | "success"
  message: string
  timestamp: string
  read: boolean
}

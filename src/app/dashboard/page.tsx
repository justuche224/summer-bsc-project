"use client"

import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Welcome to Rain Drop Finance
            </h2>
            <p className="text-muted-foreground mb-6">
              You have successfully logged in to your account.
            </p>
            <button
              onClick={() => authClient.signOut()}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


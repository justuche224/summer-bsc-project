import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction, Budget, Goal } from "./types";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface ReportData {
  user: {
    name: string;
    email: string;
  };
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    transactionCount: number;
  };
  categoryBreakdown: Record<string, number>;
}

function formatCurrency(amount: number): string {
  return `NGN ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generateFinancialReport(data: ReportData): jsPDF {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Report", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  doc.text(
    `User: ${data.user.name} (${data.user.email})`,
    pageWidth / 2,
    yPosition + 5,
    { align: "center" }
  );

  yPosition += 20;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Summary", 14, yPosition);

  yPosition += 10;

  const summaryData = [
    ["Total Income", formatCurrency(data.summary.totalIncome)],
    ["Total Expenses", formatCurrency(data.summary.totalExpenses)],
    ["Net Savings", formatCurrency(data.summary.netSavings)],
    ["Total Transactions", data.summary.transactionCount.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14 },
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Category Breakdown", 14, yPosition);

  yPosition += 10;

  const categoryData = Object.entries(data.categoryBreakdown).map(
    ([category, amount]) => [category, formatCurrency(amount)]
  );

  if (categoryData.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [["Category", "Total Spent"]],
      body: categoryData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  }

  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Budgets", 14, yPosition);

  yPosition += 10;

  if (data.budgets.length > 0) {
    const budgetData = data.budgets.map((budget) => [
      budget.category,
      formatCurrency(budget.limit),
      formatCurrency(budget.spent),
      budget.period,
      `${((budget.spent / budget.limit) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Category", "Limit", "Spent", "Period", "Usage"]],
      body: budgetData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No budgets set", 14, yPosition);
    yPosition += 15;
  }

  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Goals", 14, yPosition);

  yPosition += 10;

  if (data.goals.length > 0) {
    const goalData = data.goals.map((goal) => [
      goal.name,
      formatCurrency(goal.targetAmount),
      formatCurrency(goal.currentAmount),
      new Date(goal.deadline).toLocaleDateString(),
      `${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Name", "Target", "Current", "Deadline", "Progress"]],
      body: goalData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });

    yPosition = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No goals set", 14, yPosition);
    yPosition += 15;
  }

  if (yPosition > 230 || data.transactions.length > 10) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recent Transactions", 14, yPosition);

  yPosition += 10;

  if (data.transactions.length > 0) {
    const transactionData = data.transactions
      .slice(0, 50)
      .map((transaction) => [
        new Date(transaction.date).toLocaleDateString(),
        transaction.type,
        transaction.category,
        transaction.description,
        formatCurrency(transaction.amount),
      ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: transactionData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
      styles: { fontSize: 8 },
    });
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("No transactions found", 14, yPosition);
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc;
}

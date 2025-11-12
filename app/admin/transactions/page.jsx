// app/admin/transactions/page.jsx - WITH DELETE FUNCTIONALITY
"use client";

import { useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TransactionsPage() {
  const { fetchTransactions, transactions, loading, deleteTransaction } =
    useData();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchTransactions("admin", null, 100);
  }, [fetchTransactions]);

  const handleDelete = async (transactionId) => {
    if (
      !confirm(
        "Are you sure you want to delete this transaction? This will reverse the balance change and cannot be undone."
      )
    ) {
      return;
    }

    setDeletingId(transactionId);
    setError("");
    setSuccess("");

    const result = await deleteTransaction(transactionId, "admin");

    if (result.success) {
      setSuccess(
        "Transaction deleted successfully! Balance has been reversed."
      );
      await fetchTransactions("admin", null, 100);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message || "Failed to delete transaction");
    }

    setDeletingId(null);
  };

  const chartData = Array.from({ length: 12 }).map((_, i) => ({
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][i],
    credits: Math.floor(Math.random() * 500000),
    debits: Math.floor(Math.random() * 300000),
  }));

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Transaction Analytics
        </h1>
        <p className="text-slate-400">System-wide transaction overview</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
          {success}
        </div>
      )}

      {/* <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Monthly Trends</CardTitle>
          <CardDescription>Credits vs Debits over 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Legend />
              <Bar dataKey="credits" fill="#10b981" />
              <Bar dataKey="debits" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">
            Recent Transactions ({transactions.length})
          </CardTitle>
          <CardDescription>
            Latest 100 transactions with management actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">
                      UTR ID
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 text-slate-400">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400">
                      Commission
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400">
                      Final
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400">
                      Remark
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 50).map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-800 hover:bg-slate-800"
                    >
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                        {txn.utrId}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            txn.type === "credit"
                              ? "bg-green-900 text-green-200"
                              : "bg-red-900 text-red-200"
                          }`}
                        >
                          {txn.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        ₹{txn.amount.toFixed(2)}K
                      </td>
                      <td className="py-3 px-4 text-orange-400">
                        ₹{(txn.commission / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-blue-400">
                        ₹{txn.finalAmount.toFixed(2)}K
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {txn.remark || "-"}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          onClick={() => handleDelete(txn.id)}
                          disabled={deletingId === txn.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                        >
                          {deletingId === txn.id ? "Deleting..." : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
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
import { useAuth } from "@/context/AuthContext";

export default function StaffDashboard({ data, loading, onAddTransaction }) {
  const { user } = useAuth();

  const chartData = Array.from({ length: 7 }).map((_, i) => ({
    time: `${i * 4}h`,
    credits: Math.floor(Math.random() * 50000),
    debits: Math.floor(Math.random() * 30000),
  }));

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      {/* <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Managing: <span className="text-blue-400">{user?.currentBranch}</span>
          </p>
        </div>
        <Button onClick={onAddTransaction} className="bg-blue-600 hover:bg-blue-700">
          + Add Transaction
        </Button>
      </div> */}

      {/* Key Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Today's Credits"
          value={data?.totalCredits ? `$${(data.totalCredits   )  }` : "$0"}
          change="+15.3%"
          icon="📈"
        />
        <StatCard
          title="Today's Debits"
          value={data?.totalDebits ? `$${(data.totalDebits   )  }` : "$0"}
          change="-8.2%"
          icon="📉"
        />
        <StatCard
          title="Commission (3%)"
          value={data?.commission ? `$${(data.commission   )  }` : "$0"}
          change="+12.1%"
          icon="💰"
        />
      </div> */}

      {/* Activity Chart */}
      <Card className="bg-slate-900 border-slate-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Today's Activity</CardTitle>
          <CardDescription>Hourly credits and debits</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                }}
              />
              <Legend />
              <Bar dataKey="credits" fill="#3b82f6" />
              <Bar dataKey="debits" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              ${data?.walletBalance || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">
              Transactions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-400">
              {data?.transactionCount || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm text-slate-400">
              Avg Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-400">3%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

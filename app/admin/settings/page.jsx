"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    commissionRate: 3,
    dailyResetTime: "00:00",
    maxTransactionAmount: 100000,
    minTransactionAmount: 100,
  })

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure application behavior</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Transaction Settings</CardTitle>
            <CardDescription>Configure transaction limits and rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Commission Rate (%)</label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Default: 3%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Transaction Amount</label>
              <input
                type="number"
                value={settings.maxTransactionAmount}
                onChange={(e) => setSettings({ ...settings, maxTransactionAmount: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Min Transaction Amount</label>
              <input
                type="number"
                value={settings.minTransactionAmount}
                onChange={(e) => setSettings({ ...settings, minTransactionAmount: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Configuration</CardTitle>
            <CardDescription>General system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Daily Reset Time</label>
              <input
                type="time"
                value={settings.dailyResetTime}
                onChange={(e) => setSettings({ ...settings, dailyResetTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Time when daily data resets</p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300">
                <span className="font-semibold">Last Backup:</span> Today at 02:30 AM
              </p>
              <Button className="mt-3 bg-blue-600 hover:bg-blue-700 w-full">Backup Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
          Save Changes
        </Button>
        <Button className="bg-slate-700 hover:bg-slate-600">Cancel</Button>
      </div>
    </div>
  )
}

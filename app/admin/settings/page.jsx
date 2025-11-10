"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SettingsModal from "@/components/modals/SettingsModal"

export default function SettingsPage() {
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [settings, setSettings] = useState({
    commissionRate: 3,
    depositRate: 3,
    dailyResetTime: "00:00",
    maxTransactionAmount: 100000,
    minTransactionAmount: 100,
  })

  const handleSaveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    setShowSettingsModal(false)
  }

  return (
    <div className="p-8 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure application behavior and rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Transaction Settings</CardTitle>
            <CardDescription>Configure transaction limits and commission rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Commission Rate</p>
              <p className="text-2xl font-bold text-blue-400">{settings.commissionRate}%</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Deposit Rate</p>
              <p className="text-2xl font-bold text-green-400">{settings.depositRate}%</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Max Transaction</p>
              <p className="text-2xl font-bold text-orange-400">
                ₹{(settings.maxTransactionAmount / 1000).toFixed(1)}K
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Min Transaction</p>
              <p className="text-2xl font-bold text-slate-300">${settings.minTransactionAmount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Configuration</CardTitle>
            <CardDescription>General system settings and schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Daily Reset Time</p>
              <p className="text-2xl font-bold text-slate-300">{settings.dailyResetTime}</p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 mt-6">
              <p className="text-sm text-slate-300 mb-3">
                <span className="font-semibold">Last Backup:</span> Today at 02:30 AM
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 mb-2">Backup Now</Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600">View Backups</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-3">
        <Button onClick={() => setShowSettingsModal(true)} className="bg-blue-600 hover:bg-blue-700">
          Edit Settings
        </Button>
        <Button className="bg-slate-700 hover:bg-slate-600">Reset to Default</Button>
      </div>

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        initialSettings={settings}
      />
    </div>
  )
}

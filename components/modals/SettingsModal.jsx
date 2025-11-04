"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsModal({ isOpen, onClose, initialSettings = {} }) {
  const [settings, setSettings] = useState({
    commissionRate: initialSettings.commissionRate || 3,
    depositRate: initialSettings.depositRate || 3,
    dailyResetTime: initialSettings.dailyResetTime || "00:00",
    maxTransaction: initialSettings.maxTransaction || 100000,
    minTransaction: initialSettings.minTransaction || 100,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: name.includes("Rate") || name.includes("Transaction") ? Number.parseFloat(value) : value,
    }))
  }

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    onClose?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-800">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Commission Rate (%)</label>
              <input
                type="number"
                name="commissionRate"
                value={settings.commissionRate}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Rate (%)</label>
              <input
                type="number"
                name="depositRate"
                value={settings.depositRate}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Daily Reset Time</label>
              <input
                type="time"
                name="dailyResetTime"
                value={settings.dailyResetTime}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Transaction Amount ($)</label>
              <input
                type="number"
                name="maxTransaction"
                value={settings.maxTransaction}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Min Transaction Amount ($)</label>
              <input
                type="number"
                name="minTransaction"
                value={settings.minTransaction}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-700 mt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"

export default function ExportButton({ data, filename = "export" }) {
  const handleExportCSV = () => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleExportCSV} className="bg-slate-700 hover:bg-slate-600 text-white gap-2">
      Export CSV
    </Button>
  )
}

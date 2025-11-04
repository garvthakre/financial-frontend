import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import { DataProvider } from "@/context/DataContext"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Financial Dashboard",
  description: "Role-based financial dashboard for transactions and reporting",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={geistSans.className}>
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

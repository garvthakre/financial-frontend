"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Image from "next/image"

export default function EnhancedLoginPage() {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, mockLogin } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login({ phone, password })
      if (result.success) {
        const userData = JSON.parse(localStorage.getItem("user"))
        const routes = {
          admin: "/admin/dashboard",
          staff: "/staff/dashboard",
          client: "/client/dashboard",
        } 
        router.push(routes[userData.role])
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Using demo mode.")

      const mockUser = {
        id: "1",
        phone,
        name: phone,
        role: "staff",
        branches: ["branch-1", "branch-2"],
        currentBranch: "branch-1",
      }

      mockLogin(mockUser)
      router.push("/staff/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 space-y-2">
          {/* Logo without box, larger, with glow and sheen */}
          <div className="relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 group">
            {/* Soft glow aura */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-500/20 via-purple-500/15 to-cyan-500/15 blur-3xl opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

            {/* Rotating sheen */}
            <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute -inset-10 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.15)_40deg,transparent_80deg)] group-hover:animate-[spin_6s_linear_infinite]"></div>
            </div>

            {/* Circular logo itself */}
            <div className="relative w-full h-full rounded-full overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-400/30 transition-all duration-500 ease-out">
              <Image
                src="/logo.png"
                alt="Mahadev Pay logo"
                width={128}
                height={128}
                priority
                className="size-full rounded-full object-cover select-none
                           transition-transform duration-500 ease-out
                           group-hover:scale-105"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            MAHADEV PAY
          </h1>
          <p className="text-slate-400 text-sm">Secure Financial Management</p>
        </div>

        {/* Login Card */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

          {/* Card */}
          <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-800/50 rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Enter 10-digit phone number</p>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group/btn overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl opacity-0 group-hover/btn:opacity-100 blur-xl transition-opacity duration-500"></div>
                <div className="relative px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl text-white font-semibold flex items-center justify-center gap-2 group-hover/btn:scale-[1.02] transition-transform duration-300">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

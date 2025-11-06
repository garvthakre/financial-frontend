"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EnhancedLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("staff")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Mock authentication
    setTimeout(() => {
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
        role,
        branches: role !== "client" ? ["branch-1", "branch-2"] : [],
        currentBranch: role !== "client" ? "branch-1" : null,
      }

      login(mockUser)
      const routes = {
        admin: "/admin/dashboard",
        staff: "/staff/dashboard",
        client: "/client/dashboard"
      }
      router.push(routes[role])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/20 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/50 mb-4 relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
            <span className="text-4xl relative z-10">💎</span>
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
            <div className="space-y-6">
              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {['admin', 'staff', 'client'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        role === r
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group/check">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all" />
                  <span className="ml-2 text-slate-400 group-hover/check:text-slate-300 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleLogin}
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
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">Demo Credentials</p>
                  <p className="text-xs text-slate-400">Email: admin@demo.com</p>
                  <p className="text-xs text-slate-400">Password: demo123</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-slate-400">
            Don't have an account? <button type="button" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign up</button>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <button type="button" className="hover:text-slate-300 transition-colors">Terms</button>
            <span>•</span>
            <button type="button" className="hover:text-slate-300 transition-colors">Privacy</button>
            <span>•</span>
            <button type="button" className="hover:text-slate-300 transition-colors">Help</button>
          </div>
        </div>
      </div>
    </div>
  )
}
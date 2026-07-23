import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { login, getApiErrorMessage } from '../services/api'
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { refreshUser } = useAuth();
  // --- Form States ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // --- Validation States ---
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Regex helper ---
  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  const handleLogin =async  (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 1. Validate Email
    if (!email) {
      setError('Please input your library email registration.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address structure (e.g. reader@university.edu).')
      return
    }

    // 2. Validate Password
    if (!password) {
      setError('Please enter your password code.')
      return
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    // 3. Simulated Authentic Pass
   setIsSubmitting(true)

    try {
      const response = await login(email, password)

      localStorage.setItem("token", response.access_token);

      await refreshUser();

      navigate("/dashboard");

  } catch (error) {
      setError(getApiErrorMessage(error))
  } finally {
      setIsSubmitting(false)
  }}
  const handleContinueAsGuest = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex bg-background font-sans text-text">
      
      {/* LEFT COLUMN: Library Desk & Motivational Quote */}
      <div className="hidden md:flex md:w-1/2 bg-background border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        {/* Soft Warm Light Beam */}
        <div className="absolute top-0 right-10 w-44 h-80 bg-gradient-to-b from-amber-100/35 via-amber-50/10 to-transparent blur-lg pointer-events-none rotate-12" />

        {/* Top Header */}
        <Link to="/" className="flex items-center gap-2.5 z-10 group">
          <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/15 transition-transform group-hover:scale-105">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <span className="font-serif font-extrabold text-base tracking-tight text-text">
            StudentHub AI
          </span>
        </Link>

        {/* Center Illustration */}
        <div className="my-auto flex flex-col items-center justify-center space-y-10 z-10">
          
          {/* Desk & bookshelf illustration box */}
          <div className="w-full max-w-[340px] h-[240px] border border-border/80 bg-card rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.04)] relative p-6 flex flex-col justify-between">
            {/* Lined Bookshelf on wall */}
            <div className="w-full h-3 border-b border-border flex gap-1.5 px-4">
              <div className="h-5 w-2 bg-[#2F5D50] rounded-t-sm" />
              <div className="h-5 w-2.5 bg-[#8B5E3C] rounded-t-sm rotate-6" />
              <div className="h-6 w-2.5 bg-[#1E293B] rounded-t-sm -rotate-3" />
            </div>

            {/* Desktop illustration elements */}
            <div className="flex-grow flex items-end justify-center pb-2 relative">
              {/* Lined open ledger/notebook */}
              <div className="w-24 h-16 bg-[#FDFCF7] border border-border rounded-xs shadow-sm p-1.5 flex justify-between relative">
                {/* Spiral binding rings in the center of notepad */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 border-l border-dashed border-[#C8A97E]/65" />
                <div className="w-2/5 flex flex-col justify-between py-1">
                  <div className="w-full h-0.5 bg-text/10" />
                  <div className="w-3/4 h-0.5 bg-text/10" />
                  <div className="w-full h-0.5 bg-text/10" />
                </div>
                <div className="w-2/5 flex flex-col justify-between py-1">
                  <div className="w-full h-0.5 bg-text/10" />
                  <div className="w-3/4 h-0.5 bg-text/10" />
                  <div className="w-full h-0.5 bg-text/10" />
                </div>
              </div>

              {/* Coffee Cup next to ledger */}
              <div className="ml-4 flex flex-col items-center">
                <div className="w-5 h-6 bg-[#C8A97E] border border-[#bca178] rounded-b-sm relative">
                  <div className="absolute right-full top-1 w-1 h-2.5 border border-r-0 border-[#bca178] rounded-l-xs" />
                </div>
              </div>

              {/* Stacked books on desk */}
              <div className="ml-5 flex flex-col items-center">
                <div className="w-12 h-2.5 bg-[#2F5D50] rounded-xs shadow-sm translate-x-0.5" />
                <div className="w-14 h-3 bg-[#8B5E3C] rounded-xs shadow-sm" />
              </div>
            </div>

            {/* Desk Surface marker */}
            <div className="border-t-4 border-[#C8A97E] pt-2 text-[9px] font-sans font-bold text-text/40">
              Desk: SEC-B Catalog
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="text-center max-w-sm space-y-2">
            <p className="font-serif italic text-base text-text leading-relaxed">
              "Every great journey begins with a single page."
            </p>
            <p className="text-[10px] font-sans uppercase font-bold tracking-widest text-text/45">
              University Reading Hall Credits
            </p>
          </div>

        </div>

        {/* Bottom index marker */}
        <div className="text-[10px] font-sans text-text/45 z-10 flex justify-between">
          <span>Platform Volume V2.1</span>
          <span>&copy; StudentHub AI</span>
        </div>

      </div>

      {/* RIGHT COLUMN: Elegant Login Form Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-card relative">
        {/* Mobile-only Header Logo */}
        <div className="absolute top-8 left-8 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/15">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <span className="font-serif font-extrabold text-sm tracking-tight text-text">
              StudentHub
            </span>
          </Link>
        </div>

        {/* Core Card box */}
        <Card className="w-full max-w-md p-8 bg-card border border-border/80 shadow-[0_4px_16px_rgba(139,94,60,0.05)]">
          <div className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-text">Enter the Library</h2>
              <p className="text-xs text-text/55 font-sans">
                Sign in to synchronize study notes and bookshelf collections.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] flex items-start gap-2.5 text-xs text-red-800 font-sans">
                <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reader@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Password Code</label>
                  <a href="#" className="text-[10px] text-primary font-bold hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text/40">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-text/40 hover:text-primary transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1 select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                  disabled={isSubmitting}
                />
                <label htmlFor="remember" className="text-[11px] text-text/60 font-semibold cursor-pointer">
                  Remember my credentials
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2.5 pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 font-bold flex items-center justify-center gap-1.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Pass...
                    </>
                  ) : (
                    <>
                      Login to Library <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleContinueAsGuest}
                  variant="outline"
                  className="w-full h-10 font-bold"
                  disabled={isSubmitting}
                >
                  Continue as Guest
                </Button>
              </div>

            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/70"></div>
              <span className="flex-shrink mx-4 text-[10px] text-text/35 uppercase font-bold tracking-wider font-sans">
                OR
              </span>
              <div className="flex-grow border-t border-border/70"></div>
            </div>

             {/* Google Authentication mock */}
            <Button
              onClick={handleContinueAsGuest}
              variant="outline"
              className="w-full h-10 font-bold flex items-center justify-center gap-2 text-text/70"
              disabled={isSubmitting}
            >
              <svg className="w-4 h-4 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg> Continue with Google
            </Button>

            {/* Sign Up Redirect */}
            <p className="text-center text-[11px] text-text/50 font-sans font-medium">
              Don't have a library pass?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Register here
              </Link>
            </p>

          </div>
        </Card>
      </div>

    </div>
  )
}

export default LoginPage

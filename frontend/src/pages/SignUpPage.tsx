import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  School,
  BookOpen,
  Calendar,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { signupUser } from "../services/api";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate()

  // --- Form States ---
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [collegeName, setCollegeName] = useState('')
  const [course, setCourse] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('1st Year')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // --- Validation States ---
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 1. Assert all text fields are filled
    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (!email.trim()) {
      setError('Please input your library email registration.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address structure (e.g. reader@university.edu).')
      return
    }
    if (!password) {
      setError('Please define your account password.')
      return
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your typing.')
      return
    }
    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }
    if (!collegeName.trim()) {
      setError('Please enter your college name.')
      return
    }
    if (!course.trim()) {
      setError('Please enter your active course of study.')
      return
    }
    if (!acceptTerms) {
      setError('You must accept the library terms and rules to create an account.')
      return
    }

    // 2. Simulated Authentic registration
    setIsSubmitting(true);

    try {
      await signupUser({
      full_name: fullName,
      email,
      password,
      date_of_birth: dateOfBirth,
      college_name: collegeName,
      course,
      year_of_study: yearOfStudy,
    });

    navigate("/login");
  } catch (err: any) {
  setError(
    err.response?.data?.detail ??
    "Unable to create your account."
  );
} finally {
  setIsSubmitting(false);
}
  }

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
          
          {/* Desk illustration */}
          <div className="w-full max-w-[340px] h-[240px] border border-border/80 bg-card rounded-[10px] shadow-[0_4px_12px_rgba(139,94,60,0.04)] relative p-6 flex flex-col justify-between">
            {/* Bookshelf on wall */}
            <div className="w-full h-3 border-b border-border flex gap-1.5 px-4">
              <div className="h-5 w-2.5 bg-[#8B5E3C] rounded-t-sm" />
              <div className="h-6 w-2 bg-[#2F5D50] rounded-t-sm -rotate-6" />
              <div className="h-5.5 w-3 bg-[#1E293B] rounded-t-sm rotate-3" />
            </div>

            {/* Desktop items */}
            <div className="flex-grow flex items-end justify-center pb-2 relative">
              {/* Lined notebook */}
              <div className="w-24 h-16 bg-[#FDFCF7] border border-border rounded-xs shadow-sm p-1.5 flex justify-between relative">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 border-l border-dashed border-[#C8A97E]/65" />
                <div className="w-2/5 flex flex-col justify-between py-1">
                  <div className="w-full h-0.5 bg-text/10" />
                  <div className="w-3/4 h-0.5 bg-text/10" />
                </div>
                <div className="w-2/5 flex flex-col justify-between py-1">
                  <div className="w-full h-0.5 bg-text/10" />
                  <div className="w-3/4 h-0.5 bg-text/10" />
                </div>
              </div>

              {/* Mug */}
              <div className="ml-4 flex flex-col items-center">
                <div className="w-5 h-6 bg-[#C8A97E] border border-[#bca178] rounded-b-sm relative">
                  <div className="absolute right-full top-1 w-1 h-2.5 border border-r-0 border-[#bca178] rounded-l-xs" />
                </div>
              </div>

              {/* Stacked books */}
              <div className="ml-5 flex flex-col items-center">
                <div className="w-12 h-2.5 bg-[#2F5D50] rounded-xs shadow-sm translate-x-0.5" />
                <div className="w-14 h-3 bg-[#8B5E3C] rounded-xs shadow-sm" />
              </div>
            </div>

            {/* Bottom marker */}
            <div className="border-t-4 border-[#C8A97E] pt-2 text-[9px] font-sans font-bold text-text/40">
              Desk: SEC-C Registrar
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="text-center max-w-sm space-y-2">
            <p className="font-serif italic text-base text-text leading-relaxed">
              "A library is not a luxury but one of the necessities of life."
            </p>
            <p className="text-[10px] font-sans uppercase font-bold tracking-widest text-text/45">
              University Reading Hall Credits
            </p>
          </div>

        </div>

        {/* Bottom footer */}
        <div className="text-[10px] font-sans text-text/45 z-10 flex justify-between">
          <span>Platform Volume V2.1</span>
          <span>&copy; StudentHub AI</span>
        </div>

      </div>

      {/* RIGHT COLUMN: Registration Form Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-card relative overflow-y-auto">
        {/* Mobile Logo */}
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

        {/* Form Card */}
        <Card className="w-full max-w-md p-8 bg-card border border-border/80 shadow-[0_4px_16px_rgba(139,94,60,0.05)] my-12">
          <div className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-text">Create Reading Pass</h2>
              <p className="text-xs text-text/55 font-sans">
                Register to track your books, focus times, and summarized logs.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] flex items-start gap-2.5 text-xs text-red-800 font-sans">
                <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4 text-xs font-sans">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text/40">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Address */}
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

              {/* Grid: Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Password</label>
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
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-text/40">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-text/40 hover:text-primary transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              #to add DOB INPUT
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">
                  Date of Birth
                </label>

                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text/40">
                      <Calendar className="w-4 h-4" />
                  </span>

                  <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25"
                      disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* College Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">College/University</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text/40">
                    <School className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Grid: Course & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Course / Major</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-text/40">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/30 font-sans"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Year of Study */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text/50 uppercase tracking-wider">Year of Study</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-text/40">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-card border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 font-sans cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Accept Terms */}
              <div className="flex items-start gap-2 pt-1 select-none">
                <input
                  type="checkbox"
                  id="accept"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary mt-0.5"
                  disabled={isSubmitting}
                />
                <label htmlFor="accept" className="text-[11px] text-text/60 font-semibold cursor-pointer leading-tight">
                  I accept the library rules, privacy registers, and platform codes of conduct.
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
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Issuing Pass...
                    </>
                  ) : (
                    <>
                      Create Reading Pass <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>

            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
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
              </svg> Register with Google
            </Button>

            {/* Login Redirect */}
            <p className="text-center text-[11px] text-text/50 font-sans font-medium">
              Already have a library pass?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Login here
              </Link>
            </p>

          </div>
        </Card>
      </div>

    </div>
  )
}

export default SignUpPage

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  Mail,
  MapPin,
  ExternalLink,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '../components/ui/Button'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [lampOn, setLampOn] = useState(true)
  const [coffeeSteam, setCoffeeSteam] = useState(false)
  const [deskTip, setDeskTip] = useState('Click on the desk lamp, coffee mug, bookshelf volumes, or notebook to interact with your quiet study desk!')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text flex flex-col justify-between selection:bg-primary/20">
      
      {/* 1. STICKY NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md transition-all duration-300 ${
        hasScrolled ? 'border-b border-border shadow-sm py-3' : 'py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/15 transition-transform group-hover:scale-105">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <span className="font-serif font-extrabold text-base tracking-tight text-text">
              StudentHub AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-sans font-semibold text-text/60">
            <a href="#hero" className="hover:text-primary transition-colors">Home</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-text/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="h-4 w-px bg-border/60 mx-1"></div>
            <Button
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              className="text-xs h-9 px-4 font-semibold cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="pt-32 pb-24 px-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left text */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-primary/10 border border-primary/20 text-[10px] uppercase font-bold font-sans text-primary tracking-wider">
              <BookOpen className="w-3.5 h-3.5" /> Digital Archival System
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-text leading-[1.15]">
              Your Personal Digital Library for Smarter Learning
            </h1>
            <p className="text-sm md:text-base text-text/60 font-sans leading-relaxed max-w-lg">
              Study smarter with AI-powered learning tools designed to help students summarize notes, generate quizzes, organize study plans, and improve productivity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-3.5"
          >
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              className="text-xs h-11 px-6 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              Begin Learning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="text-xs h-11 px-6 font-bold cursor-pointer"
            >
              Explore Dashboard
            </Button>
          </motion.div>
        </div>

        {/* Right side Cozy Reading Room Illustration */}
        <div className="lg:col-span-6 flex flex-col justify-center items-stretch">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[480px] mx-auto aspect-[4/3] bg-card border border-border rounded-[10px] shadow-[0_8px_30px_rgba(139,94,60,0.06)] relative p-6 overflow-hidden select-none"
          >
            {/* Custom SVG Reading Room */}
            <svg viewBox="0 0 400 300" fill="none" className="w-full h-full text-text" xmlns="http://www.w3.org/2000/svg">
              {/* Window Shadow Light Beam */}
              <path d="M120 -20 L280 320 L180 320 L60 -20 Z" fill="url(#window-light)" opacity={lampOn ? "0.2" : "0.55"} className="transition-opacity duration-500" />

              {/* Back Wall Window Grid */}
              <rect x="80" y="20" width="240" height="120" rx="4" fill="#FAF6F0" stroke="#E8E2D8" strokeWidth="1.5" />
              <line x1="200" y1="20" x2="200" y2="140" stroke="#E8E2D8" strokeWidth="1.5" />
              <line x1="80" y1="80" x2="320" y2="80" stroke="#E8E2D8" strokeWidth="1.5" />

              {/* Wooden Bookshelf on Left */}
              <g transform="translate(10, 40)">
                <rect x="0" y="0" width="40" height="180" rx="3" fill="#8B5E3C" />
                <rect x="4" y="4" width="32" height="172" fill="#6D472B" />
                {/* Shelves */}
                <line x1="4" y1="45" x2="36" y2="45" stroke="#8B5E3C" strokeWidth="2.5" />
                <line x1="4" y1="90" x2="36" y2="90" stroke="#8B5E3C" strokeWidth="2.5" />
                <line x1="4" y1="135" x2="36" y2="135" stroke="#8B5E3C" strokeWidth="2.5" />
                
                {/* Books standing */}
                <rect x="6" y="15" width="6" height="30" fill="#2F5D50" rx="1" className="cursor-pointer hover:fill-[#3a7262] transition-colors" onClick={() => setDeskTip("You checked out the Database textbook: 'All data is stored in the leaf nodes of a B+ Tree, making sequential range scans extremely rapid!'")} />
                <rect x="13" y="10" width="8" height="35" fill="#C8A97E" rx="1" className="cursor-pointer hover:fill-[#d6ba92] transition-colors" onClick={() => setDeskTip("You pulled out the Systems ledger: 'Operating systems utilize memory pagination (fixed-size frames) to avoid external fragmentation.'")} />
                <rect x="22" y="20" width="7" height="25" fill="#1E293B" rx="1" className="cursor-pointer hover:fill-[#2d3d57] transition-colors" onClick={() => setDeskTip("You opened the Compiler Design manual: 'Lexical analysis breaks source strings into tokens like keywords, identifiers, and operators.'")} />

                <rect x="6" y="60" width="7" height="30" fill="#C8A97E" rx="1" className="cursor-pointer hover:fill-[#d6ba92] transition-colors" onClick={() => setDeskTip("You checked out the Software Engineering volume: 'Cohesion refers to how closely related the responsibilities inside a single module are.'")} />
                <rect x="14" y="55" width="6" height="35" fill="#78350F" rx="1" className="cursor-pointer hover:fill-[#944315] transition-colors" onClick={() => setDeskTip("You read the Networks book: 'TCP establishes connection via a three-way handshake (SYN, SYN-ACK, ACK) to ensure reliable byte streams.'")} />
                <rect x="21" y="50" width="9" height="40" fill="#2F5D50" rx="1" className="cursor-pointer hover:fill-[#3a7262] transition-colors" onClick={() => setDeskTip("You loaded the Distributed Systems log: 'CAP theorem proves a system cannot guarantee Consistency, Availability, and Partition tolerance simultaneously.'")} />

                <rect x="6" y="105" width="8" height="30" fill="#1E293B" rx="1" className="cursor-pointer hover:fill-[#2d3d57] transition-colors" onClick={() => setDeskTip("You checked out the Algorithms volume: 'Binary Search achieves O(log N) lookup time by recursively halving the sorted search space.'")} />
                <rect x="15" y="112" width="7" height="23" fill="#8B5E3C" rx="1" className="cursor-pointer hover:fill-[#a8744c] transition-colors" onClick={() => setDeskTip("You opened the Security guide: 'Asymmetric encryption uses a public key to encrypt transcripts, which only the matching private key can decrypt.'")} />
                <rect x="23" y="102" width="6" height="33" fill="#7A9D7A" rx="1" className="cursor-pointer hover:fill-[#93bd93] transition-colors" onClick={() => setDeskTip("You pulled the Automata journal: 'Regular expressions are equivalent to Finite State Automata, recognizing Type 3 regular languages.'")} />
              </g>

              {/* Wooden Bookshelf on Right */}
              <g transform="translate(350, 40)">
                <rect x="0" y="0" width="40" height="180" rx="3" fill="#8B5E3C" />
                <rect x="4" y="4" width="32" height="172" fill="#6D472B" />
                {/* Shelves */}
                <line x1="4" y1="45" x2="36" y2="45" stroke="#8B5E3C" strokeWidth="2.5" />
                <line x1="4" y1="90" x2="36" y2="90" stroke="#8B5E3C" strokeWidth="2.5" />
                <line x1="4" y1="135" x2="36" y2="135" stroke="#8B5E3C" strokeWidth="2.5" />
                
                {/* Books standing */}
                <rect x="6" y="12" width="8" height="33" fill="#78350F" rx="1" className="cursor-pointer hover:fill-[#944315] transition-colors" onClick={() => setDeskTip("You checked the DBMS Tuning index: 'Adding an index speeds up SELECT read queries, but slows down INSERT and UPDATE write queries.'")} />
                <rect x="15" y="18" width="6" height="27" fill="#C8A97E" rx="1" className="cursor-pointer hover:fill-[#d6ba92] transition-colors" onClick={() => setDeskTip("You opened the Web Architecture notes: 'REST APIs utilize HTTP methods like GET, POST, PUT, DELETE to represent stateless operations.'")} />
                <rect x="22" y="8" width="8" height="37" fill="#2F5D50" rx="1" className="cursor-pointer hover:fill-[#3a7262] transition-colors" onClick={() => setDeskTip("You read the Virtualization report: 'Hypervisors split physical hardware resources to run multiple guest operating systems.'")} />

                <rect x="6" y="58" width="9" height="32" fill="#1E293B" rx="1" className="cursor-pointer hover:fill-[#2d3d57] transition-colors" onClick={() => setDeskTip("You loaded the Concurrent Programming manual: 'A race condition occurs when multiple threads read/write shared memory without serialization.'")} />
                <rect x="16" y="52" width="6" height="38" fill="#C8A97E" rx="1" className="cursor-pointer hover:fill-[#d6ba92] transition-colors" onClick={() => setDeskTip("You checked the Cloud Architecture guidelines: 'Load balancers distribute user traffic to backends based on round-robin or least-connection models.'")} />
                <rect x="23" y="62" width="7" height="28" fill="#8B5E3C" rx="1" className="cursor-pointer hover:fill-[#a8744c] transition-colors" onClick={() => setDeskTip("You opened the Cryptography digest: 'Salt values are appended to user passwords before hashing to protect against pre-computed rainbow table lookups.'")} />
              </g>

              {/* Indoor Plant beside right shelf */}
              <g transform="translate(315, 170)">
                {/* Pot */}
                <path d="M8 35 L22 35 L25 50 L5 50 Z" fill="#C8A97E" stroke="#bca076" className="cursor-pointer" onClick={() => setDeskTip("A peaceful Monstera plant. Keep it near the bookshelf to maintain library air flow!")} />
                {/* Leaves */}
                <path d="M15 35 Q10 15 0 20" stroke="#2F5D50" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M15 35 Q20 10 30 15" stroke="#2F5D50" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M15 35 Q15 5 12 -5" stroke="#2F5D50" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M15 35 Q8 20 -5 10" stroke="#7A9D7A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>

              {/* Main Reading Desk */}
              <g transform="translate(60, 200)">
                {/* Wooden Desk Surface */}
                <rect x="0" y="20" width="280" height="15" rx="3" fill="#8B5E3C" stroke="#785133" strokeWidth="1" />
                <rect x="0" y="35" width="280" height="6" fill="#6D472B" />
                
                {/* Desk Legs */}
                <rect x="15" y="41" width="12" height="60" fill="#8B5E3C" />
                <rect x="253" y="41" width="12" height="60" fill="#8B5E3C" />
                <line x1="27" y1="85" x2="253" y2="85" stroke="#6D472B" strokeWidth="3.5" />

                {/* Desk Lamp */}
                <g transform="translate(30, -50)" className="cursor-pointer" onClick={() => {
                  setLampOn(!lampOn)
                  setDeskTip(lampOn ? "Flipped the desk lamp OFF. Ambient window shadow fills the room." : "Flipped the desk lamp ON. A warm study glow illuminates the open desk books!")
                }}>
                  {/* Lamp base */}
                  <rect x="12" y="65" width="16" height="5" rx="1.5" fill="#2F5D50" />
                  {/* Stem */}
                  <path d="M20 65 Q10 40 28 20" stroke="#2F5D50" strokeWidth="3.5" fill="none" />
                  {/* Shade */}
                  <path d="M22 10 L42 22 L32 28 Z" fill="#2F5D50" stroke="#23483E" strokeWidth="1" />
                  {/* Warm light cone */}
                  <polygon points="34 26, -5 100, 75 100" fill="url(#lamp-light)" opacity={lampOn ? "0.35" : "0"} className="transition-opacity duration-300" />
                </g>

                {/* Open Hardcover Book on Desk */}
                <g transform="translate(100, 5)" className="cursor-pointer" onClick={() => setDeskTip("You clicked the open book: 'Active study sessions with Pomodoro integration yields 25% higher recall parameters.'")}>
                  <path d="M4 14 Q24 16 48 14 Q24 17 4 14" stroke="#78350F" strokeWidth="4.5" fill="none" />
                  <path d="M5 12 C18 14 24 14 24 13.5 C24 14 30 14 43 12 V3 C30 5 24 5 24 4.5 C24 5 18 5 5 3 Z" fill="#FAF6F0" stroke="#E8E2D8" strokeWidth="1" />
                  <line x1="24" y1="4.5" x2="24" y2="13.5" stroke="#8B5E3C" strokeWidth="1.5" />
                </g>

                {/* Notebook */}
                <g transform="translate(170, 10)" className="cursor-pointer" onClick={() => setDeskTip("You checked the desk notepad doodles: 'You drew a B+ tree splitting operations and a cup of coffee.'")}>
                  <rect x="0" y="0" width="40" height="25" rx="1" fill="#FFFFFF" stroke="#E8E2D8" strokeWidth="1" transform="rotate(-6)" />
                  <line x1="5" y1="6" x2="35" y2="3" stroke="#C8A97E" strokeWidth="0.75" transform="rotate(-6)" />
                  <line x1="5" y1="12" x2="35" y2="9" stroke="#C8A97E" strokeWidth="0.75" transform="rotate(-6)" />
                </g>

                {/* Steaming Coffee Mug */}
                <g transform="translate(230, 2)" className="cursor-pointer" onClick={() => {
                  setCoffeeSteam(true)
                  setDeskTip("Freshly brewed library coffee steam rises: 'A rich roast with hints of chocolate and dark malt.'")
                  setTimeout(() => setCoffeeSteam(false), 2000)
                }}>
                  <rect x="0" y="5" width="12" height="15" rx="2" fill="#2F5D50" />
                  <path d="M12 8 Q16 10 12 14" stroke="#2F5D50" strokeWidth="2.2" fill="none" />
                  {/* Steaming effect */}
                  {coffeeSteam && (
                    <g opacity="0.6">
                      <path d="M3 0 Q0 -4 3 -8" stroke="#8B5E3C" strokeWidth="1.2" fill="none" />
                      <path d="M8 2 Q6 -2 8 -6" stroke="#8B5E3C" strokeWidth="1.2" fill="none" />
                    </g>
                  )}
                </g>
              </g>

              {/* Definition gradients */}
              <defs>
                <linearGradient id="window-light" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lamp-light" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#FDE047" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Interactive Desk Feedback panel */}
          <div className="max-w-[480px] w-full mx-auto mt-4 p-3 bg-card border border-border rounded-[10px] shadow-sm flex items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <p className="text-[10px] font-serif italic text-text/80 leading-relaxed">
                {deskTip}
              </p>
            </div>
            <button
              onClick={() => setDeskTip("Click on the desk lamp, coffee mug, bookshelf volumes, or notebook to interact with your quiet study desk!")}
              className="text-[9px] font-sans font-bold text-accent hover:text-primary transition-colors uppercase tracking-widest flex-shrink-0 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER / CONTACT */}
      <footer id="contact" className="bg-text text-background/90 py-16 px-6 font-sans text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Logo & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/15">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <span className="font-serif font-extrabold text-base tracking-tight text-background">
                StudentHub AI
              </span>
            </div>
            <p className="text-[11px] text-background/50 leading-relaxed max-w-xs">
              A premium, handcrafted university reading experience designed for technical and academic students.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3.5">
            <h5 className="font-serif font-bold text-background tracking-wide uppercase text-[10px]">Academic Directory</h5>
            <ul className="space-y-2.5 text-background/60 text-[11px]">
              <li>
                <Link to="/login" className="hover:text-background transition-colors">Study Dashboard</Link>
              </li>
              <li>
                <a href="https://github.com/zohakhaderT/StudentHub-AI" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors flex items-center gap-1">
                  GitHub Reference <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="space-y-3.5">
            <h5 className="font-serif font-bold text-background tracking-wide uppercase text-[10px]">Contact Desk</h5>
            <div className="space-y-2 text-background/60 text-[11px] font-sans">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>support@studenthub-ai.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>University Library, Desk 4B</span>
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-background/40">
          <span>&copy; 2026 StudentHub AI. All library catalog rules apply.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-background transition-colors">Privacy ledger</a>
            <a href="#" className="hover:text-background transition-colors">Terms of borrow</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage

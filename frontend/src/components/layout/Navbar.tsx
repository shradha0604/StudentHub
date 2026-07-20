import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Bell, Menu, Compass, Sun, Moon, User, LogOut, Settings as SettingsIcon, BookOpenCheck } from 'lucide-react'
import { useToast } from '../ui/Toast'
import { useSearch } from '../../context/SearchContext'

interface NavbarProps {
  onToggleSidebar: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { showToast } = useToast()
  const { searchQuery, setSearchQuery } = useSearch()
  const navigate = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return document.documentElement.classList.contains('dark')
  })

  // Sync Dark Mode state to root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sampleNotifications = [
    { id: '1', title: 'Upcoming Study Session', desc: 'DBMS quiz prep starts in 30 minutes.', time: '10m ago', unread: true },
    { id: '2', title: 'Quiz Completed', desc: 'Virtual Memory quiz stamp: Stamped with A!', time: '2h ago', unread: true },
    { id: '3', title: 'Assignment Reminder', desc: 'Syllabus CS-304 outline draft due tomorrow.', time: '5h ago', unread: false },
    { id: '4', title: 'Recommended Reading', desc: 'Read Chapter 5: TCP Congestion Control.', time: '1d ago', unread: false },
  ]

  const handleLogout = () => {
    showToast('Logged out of StudentHub library session.')
    setTimeout(() => {
      navigate('/')
    }, 500)
  }

  const handleProfileClick = () => {
    showToast('Profile credentials portal is active.')
    setShowUserMenu(false)
  }

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border bg-card/95 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Left items: Toggle menu & title info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-2 text-text/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-text/55 tracking-wider uppercase font-sans">
          <Compass className="w-4 h-4 text-primary animate-spin-slow" />
          <span>Library System Connected</span>
        </div>
      </div>

      {/* Middle: Library Catalog Search Bar */}
      <div className="flex-grow max-w-md mx-6">
        <div className="relative flex items-center w-full">
          <span className="absolute left-3.5 text-text/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog, notes, flashcards, or planner..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border text-text rounded-[10px] focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/25 placeholder:text-text/40 font-sans transition-all duration-150"
          />
        </div>
      </div>

      {/* Right items: Notifications & User profile */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={bellRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-text/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-[10px] shadow-lg py-2 z-30 font-sans text-xs">
              <div className="px-4 py-2 border-b border-border/60 flex items-center justify-between">
                <span className="font-bold text-text">Notifications</span>
                <span className="text-[10px] text-accent font-semibold">2 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-border/40">
                {sampleNotifications.map((notif) => (
                  <div key={notif.id} className={`p-3.5 hover:bg-background/40 transition-colors flex gap-2.5 items-start ${notif.unread ? 'bg-secondary/5' : ''}`}>
                    <div className="mt-0.5">
                      <BookOpenCheck className={`w-3.5 h-3.5 ${notif.unread ? 'text-primary' : 'text-text/40'}`} />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <p className={`font-semibold text-text leading-tight ${notif.unread ? 'font-bold' : ''}`}>
                        {notif.title}
                      </p>
                      <p className="text-[10px] text-text/60 leading-normal">{notif.desc}</p>
                      <p className="text-[9px] text-text/40">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button (Main Navbar) */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-text/60 hover:text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle theme"
        >
          {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        <div className="h-px w-4 bg-border/60"></div>

        {/* User Card & Dropdown */}
        <div className="relative" ref={userRef}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-text leading-tight">Zoha Khader</p>
              <p className="text-[10px] text-text/45 font-medium">Academic Reader</p>
            </div>
            <div className="h-8 w-8 rounded-[10px] border border-secondary/50 bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shadow-sm">
              ZK
            </div>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-[10px] shadow-lg py-1.5 z-30 font-sans text-xs divide-y divide-border/40">
              {/* Profile details preview */}
              <div className="px-4 py-2.5 bg-background/30">
                <p className="font-bold text-text">Zoha Khader</p>
                <p className="text-[10px] text-text/50">zoha@studenthub-ai.edu</p>
              </div>

              {/* Action items */}
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-2 hover:bg-background/60 text-text/80 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-4 py-2 hover:bg-background/60 text-text/80 hover:text-primary transition-colors flex items-center gap-2.5 cursor-pointer block"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Dark mode switcher option */}
              <div className="px-4 py-2 flex items-center justify-between text-text/80">
                <span className="flex items-center gap-2.5">
                  {darkMode ? <Moon className="w-3.5 h-3.5 text-primary" /> : <Sun className="w-3.5 h-3.5 text-primary" />}
                  <span>Dark Mode</span>
                </span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${darkMode ? 'bg-primary' : 'bg-border'}`}
                  aria-label="Toggle theme"
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Logout button */}
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

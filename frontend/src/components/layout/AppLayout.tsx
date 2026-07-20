import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchProvider } from '../../context/SearchContext'

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const location = useLocation()

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <SearchProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Content Area */}
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          {/* Top Navbar */}
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Scrollable Page Body */}
          <main className="flex-grow overflow-y-auto px-6 py-8 flex flex-col justify-between">
            <div className="max-w-6xl w-full mx-auto flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Subtle Page Footer */}
            <div className="max-w-6xl w-full mx-auto mt-auto">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  )
}

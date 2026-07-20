import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Library,
  BookMarked,
  BookOpen,
  Cpu,
  FileText,
  Settings,
  X,
  GraduationCap,
  ClipboardCheck,
  Compass,
  Edit,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    { name: 'Study Dashboard', path: '/dashboard', icon: Library },
    { name: 'My Bookshelf', path: '/bookshelf', icon: BookMarked },
    { name: 'Reading Room', path: '/reading-room', icon: BookOpen },
    { name: 'AI Tutor', path: '/tutor', icon: Cpu },
    { name: 'Notes Summarizer', path: '/notes', icon: FileText },
    { name: 'Quiz Generator', path: '/quiz', icon: ClipboardCheck },
    { name: 'Study Planner', path: '/planner', icon: Compass },
    { name: 'Assignment Helper', path: '/assignment-helper', icon: Edit },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Preferences', path: '/settings', icon: Settings },
  ]

  const activeClass = 'relative group flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-primary text-white shadow-sm transition-all duration-200'
  const inactiveClass = 'relative group flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-xs font-medium text-text/75 hover:bg-secondary/15 hover:text-primary transition-all duration-200'

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-text/25 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 border-r border-border bg-card flex flex-col justify-between transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Header area */}
          <div className={`h-16 px-6 border-b border-border flex items-center justify-between ${isCollapsed ? 'justify-center px-4' : ''}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-[10px] bg-accent text-white flex items-center justify-center shadow-md shadow-accent/10 flex-shrink-0">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              {!isCollapsed && (
                <span className="font-serif font-extrabold text-base tracking-tight text-text whitespace-nowrap">
                  StudentHub AI
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-text/40 hover:text-text/75 hover:bg-background rounded-[10px] transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5">
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold text-text/35 tracking-wider uppercase mb-3 font-sans">
                Study portals
              </p>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => (isActive ? activeClass : inactiveClass) + (isCollapsed ? ' justify-center px-2' : '')}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                  
                  {/* Tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3.5 px-2.5 py-1.5 bg-text text-white text-[10px] font-sans font-semibold rounded-[6px] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50 shadow-md">
                      {item.name}
                      {/* Tooltip small arrow */}
                      <div className="absolute top-1/2 -translate-y-1/2 right-full border-4 border-transparent border-r-text" />
                    </div>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer/System Status & Toggle Collapse */}
        <div className="p-4 border-t border-border bg-background/20 space-y-3">
          
          {/* Status Display */}
          {!isCollapsed ? (
            <div className="p-3 bg-card border border-border rounded-[10px] flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0"></div>
              <div className="text-[10px] text-text/60 overflow-hidden leading-normal">
                <p className="font-semibold text-text/80">Archival Core v1</p>
                <p className="truncate">System operational</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" title="System operational"></div>
            </div>
          )}

          {/* Expand/Collapse Toggle Button for Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2 text-text/40 hover:text-text/75 hover:bg-secondary/10 border border-border/40 rounded-[10px] transition-colors cursor-pointer focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
              <div className="flex items-center gap-2 text-[10px] font-bold font-sans uppercase tracking-wider">
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Menu</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

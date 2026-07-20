import React from 'react'
import { motion } from 'framer-motion'
import { QuillMascot } from './QuillMascot'

interface LoadingProps {
  message?: string
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Searching the library...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4 text-center select-none">
      
      {/* Quill Mascot loading display */}
      <QuillMascot size={72} mood="reading" className="mb-2" />

      {/* 3D Page Turning Book Animation Container */}
      <div 
        className="relative w-16 h-10 flex items-center justify-center"
        style={{ perspective: '400px' }}
      >
        {/* Left Page (Static Back) */}
        <div className="absolute left-0 top-0 w-8 h-full bg-[#FAF6F0] border border-border border-r-0 rounded-l-[4px] shadow-xs origin-right" />
        
        {/* Right Page (Static Back) */}
        <div className="absolute right-0 top-0 w-8 h-full bg-[#FAF6F0] border border-border border-l-0 rounded-r-[4px] shadow-xs origin-left" />
        
        {/* Flipping Page (Centered) */}
        <motion.div
          className="absolute right-0 top-0 w-8 h-full bg-[#FAF6F0] border border-border border-l-0 rounded-r-[4px] shadow-sm origin-left"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          animate={{
            rotateY: [0, -180],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: 'easeInOut',
          }}
        />

        {/* Book Spine Center Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-primary/20 shadow-xs z-10" />
      </div>

      {/* Message */}
      <div className="space-y-1">
        <motion.p
          className="text-[11px] font-serif italic text-text/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          {message}
        </motion.p>
      </div>

    </div>
  )
}

export default Loading

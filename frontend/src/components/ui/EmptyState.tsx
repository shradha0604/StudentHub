import React from 'react'
import { Card, CardTitle, CardDescription } from './Card'
import { QuillMascot } from './QuillMascot'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  // Determine Quill's mood based on context keywords
  const isSearchEmpty =
    title.toLowerCase().includes('search') ||
    title.toLowerCase().includes('no match') ||
    description.toLowerCase().includes('search') ||
    description.toLowerCase().includes('find')

  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed bg-background/25">
      
      {/* Quill Mascot illustration */}
      <QuillMascot
        size={80}
        mood={isSearchEmpty ? 'searching' : 'default'}
        className="mb-4"
      />

      <CardTitle className="mb-2 text-base font-serif font-bold text-text">
        {title}
      </CardTitle>
      
      <CardDescription className="max-w-xs text-xs text-text/50 font-sans leading-relaxed mb-6">
        {description}
      </CardDescription>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-sans text-xs font-semibold rounded-[10px] shadow-sm transition-all duration-200 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}

    </Card>
  )
}

export default EmptyState

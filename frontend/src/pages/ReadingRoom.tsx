import React from 'react'
import { Card } from '../components/ui/Card'
import { BookOpen } from 'lucide-react'

const ReadingRoom: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Reading Room</h1>
        <p className="text-sm text-text/60 font-sans">
          A calm, distraction-free environment to read publications and annotate texts.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <BookOpen className="w-12 h-12 text-primary/40 mb-4" />
          <h2 className="text-xl font-serif font-bold text-text mb-2">No Active Volume</h2>
          <p className="text-sm text-text/60 max-w-sm mb-4">
            Select a book or research paper from your bookshelf to open it here in study view.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ReadingRoom

import React from 'react'
import { Card } from '../components/ui/Card'
import { Cpu } from 'lucide-react'

const ResearchHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Research Assistant</h1>
        <p className="text-sm text-text/60 font-sans">
          Analyze manuscripts, ask context questions, and summarize long papers using AI models.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Cpu className="w-12 h-12 text-accent/40 mb-4" />
          <h2 className="text-xl font-serif font-bold text-text mb-2">Research Assistant Offline</h2>
          <p className="text-sm text-text/60 max-w-sm">
            AI helper features will be fully functional once backend LLM integrations are completed.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default ResearchHub

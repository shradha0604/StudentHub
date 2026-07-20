import React from 'react'
import { Card } from '../components/ui/Card'
import { Settings as SettingsIcon } from 'lucide-react'

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-serif text-text mb-1">Preferences & Settings</h1>
        <p className="text-sm text-text/60 font-sans">
          Configure reader styling, typography, API connection limits, and credentials.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <SettingsIcon className="w-12 h-12 text-primary/40 mb-4 animate-spin-slow" />
          <h2 className="text-xl font-serif font-bold text-text mb-2">Configuration Portal</h2>
          <p className="text-sm text-text/60 max-w-sm">
            Default configurations are active. Custom preference options will be implemented in subsequent phases.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Settings

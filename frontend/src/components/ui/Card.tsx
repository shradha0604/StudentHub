import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`bg-card border border-border rounded-[10px] shadow-[0_2px_8px_-3px_rgba(139,94,60,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-5 pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardTitle: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <h3
      className={`font-serif text-lg font-bold text-text tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <p className={`font-sans text-xs text-text/60 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  )
}

export const CardContent: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-5 pt-0 text-sm leading-relaxed text-text/80 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`p-5 pt-0 flex items-center border-t border-border/40 mt-4 pt-4 text-xs text-text/60 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

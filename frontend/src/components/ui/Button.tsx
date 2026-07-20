import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:pointer-events-none rounded-[10px]'

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary/15 text-primary hover:bg-secondary/25 border border-secondary/25',
    accent: 'bg-accent text-white hover:bg-accent/90 shadow-sm',
    outline: 'border border-border text-text hover:bg-secondary/10',
    ghost: 'text-text hover:bg-secondary/10 hover:text-primary',
  }

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

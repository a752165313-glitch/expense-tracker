'use client'

import { Menu, Bell } from 'lucide-react'

interface TopbarProps {
  onMenuClick: () => void
  title: string
  subtitle?: string
}

export function Topbar({ onMenuClick, title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 text-base leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}

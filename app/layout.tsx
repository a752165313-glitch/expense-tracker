import type { Metadata } from 'next'
import './globals.css'
import { ExpenseProvider } from '@/context/ExpenseContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ExpenseAI — Personal Finance Tracker',
  description: 'Track your personal expenses with ease',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ExpenseProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 500,
              },
              success: {
                iconTheme: { primary: '#6366f1', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </ExpenseProvider>
      </body>
    </html>
  )
}

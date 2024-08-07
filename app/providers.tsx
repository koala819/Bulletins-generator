'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { SessionProvider } from '@/context/SessionContext'
import { useSession } from '@/context/SessionContext'

function SessionContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement ...
      </div>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionContent>
        {children}
        <ToastContainer position="top-right" />
      </SessionContent>
    </SessionProvider>
  )
}

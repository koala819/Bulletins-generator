// contexts/SessionContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// contexts/SessionContext.tsx

// contexts/SessionContext.tsx

type Session = 1 | 2

interface SessionDates {
  session1: string
  session2: string
}

interface SessionContextType {
  session: Session
  // eslint-disable-next-line no-unused-vars
  setSession: (session: Session) => void
  sessionDates: SessionDates
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session>(1)
  const [sessionDates, setSessionDates] = useState<SessionDates>({
    session1: '',
    session2: '',
  })

  useEffect(() => {
    fetch(`${process.env.API_URL}/api/top`)
      .then((res) => res.json())
      .then((data) => {
        const topValues = data.data[0]
        setSessionDates({
          session1: topValues['dates-Session1'],
          session2: topValues['dates-Session2'],
        })

        const today = new Date()
        const session1End = new Date(
          topValues['dates-Session1'].split('au')[1].trim(),
        )
        setSession(today <= session1End ? 1 : 2)
      })
  }, [])

  return (
    <SessionContext.Provider value={{ session, setSession, sessionDates }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

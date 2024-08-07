'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
  isLoading: boolean
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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)

    async function fecthData() {
      try {
        const response = await fetch(`${process.env.API_URL}/api/top`)
        const data = await response.json()
        setSessionDates({
          session1: data.data[0]['dates-Session1'],
          session2: data.data[0]['dates-Session2'],
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fecthData()
  }, [])

  return (
    <SessionContext.Provider
      value={{ session, setSession, sessionDates, isLoading }}
    >
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

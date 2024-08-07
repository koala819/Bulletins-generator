import { Metadata } from 'next'

import GradeEntry from '@/components/atoms/GradeEntry'

export const metadata: Metadata = {
  title: 'Notes des élèves',
  alternates: {
    canonical: `${process.env.API_URL}/grades`,
  },
}

const GradeEntryPage = () => {
  return <GradeEntry />
}

export default GradeEntryPage

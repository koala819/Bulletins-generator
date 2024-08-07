import { Metadata } from 'next'

import Try from '@/components/molecules/Try'

export const metadata: Metadata = {
  title: 'Bulletins des élèves',
  alternates: {
    canonical: `${process.env.API_URL}/report`,
  },
}

const ReportPage = () => {
  return <Try />
}

export default ReportPage

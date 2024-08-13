import { Metadata } from 'next'

import BulletinScolaire from '@/components/molecules/BulletinScolaire'

export const metadata: Metadata = {
  title: 'Bulletins des élèves',
  alternates: {
    canonical: `${process.env.API_URL}/report`,
  },
}

const ReportPage = () => {
  return <BulletinScolaire />
}

export default ReportPage

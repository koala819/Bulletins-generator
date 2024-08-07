import { Metadata } from 'next'

import { TopConfig } from '@/components/atoms/TopConfig'

export const metadata: Metadata = {
  title: 'Configuration',
  alternates: {
    canonical: `${process.env.API_URL}/conf/top`,
  },
}

const TopConfigPage = () => {
  return <TopConfig />
}

export default TopConfigPage

import { Metadata } from 'next'

import { TopConfig } from '@/components/molecules/TopConfig'

export const metadata: Metadata = {
  title: 'Configuration',
  alternates: {
    canonical: `${process.env.CLIENT_URL}/conf/top`,
  },
}

const TopConfigPage = () => {
  return <TopConfig />
}

export default TopConfigPage

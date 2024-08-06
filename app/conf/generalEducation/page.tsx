import { Metadata } from 'next'

import { GeneralEducationConfig } from '@/components/atoms/GeneralEducationConfig'

export const metadata: Metadata = {
  title: 'Enseignement Général et Scientifique',
  alternates: {
    canonical: `${process.env.CLIENT_URL}/conf/genschool`,
  },
}

const GenSchoolPage = () => {
  return <GeneralEducationConfig />
}

export default GenSchoolPage

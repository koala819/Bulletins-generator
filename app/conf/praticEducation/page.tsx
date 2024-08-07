import { Metadata } from 'next'

import { EducationConfig } from '@/components/atoms/EducationConfig'

export const metadata: Metadata = {
  title: 'Enseignement Pratique',
  alternates: {
    canonical: `${process.env.API_URL}/conf/praticEducation`,
  },
}

const GenSchoolPage = () => {
  return <EducationConfig type={'pratic'} />
}

export default GenSchoolPage

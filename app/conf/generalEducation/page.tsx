import { Metadata } from 'next'

import { EducationConfig } from '@/components/atoms/EducationConfig'

export const metadata: Metadata = {
  title: 'Enseignement Général et Scientifique',
  alternates: {
    canonical: `${process.env.API_URL}/conf/generalEducation`,
  },
}

const GenSchoolPage = () => {
  return <EducationConfig type={'general'} />
}

export default GenSchoolPage

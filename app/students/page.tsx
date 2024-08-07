import { Metadata } from 'next'

import { StudentList } from '@/components/atoms/StudentList'

export const metadata: Metadata = {
  title: 'Liste des élèves',
  alternates: {
    canonical: `${process.env.CLIENT_URL}/students`,
  },
}

const CreateStudentPage = () => {
  return <StudentList />
}

export default CreateStudentPage

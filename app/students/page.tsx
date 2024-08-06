import { Metadata } from 'next'

import { StudentsForm } from '@/components/molecules/StudendsForm'

export const metadata: Metadata = {
  title: 'Création nouvel élève',
  alternates: {
    canonical: `${process.env.CLIENT_URL}/students`,
  },
}

const CreateStudentPage = () => {
  return (
    <StudentsForm
      title="Créer un nouvel élève"
      description="Remplissez les informations ci-dessous pour ajouter un nouvel élève."
    />
  )
}

export default CreateStudentPage

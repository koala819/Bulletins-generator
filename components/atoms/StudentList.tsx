'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function StudentList() {
  const [students, setStudents] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/students`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const result = await response.json()
        console.log('result', result)
        setStudents(result.data)
      } catch (error) {
        toast.error('Erreur lors de la récupération des étudiants')
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle>Liste des étudiants</CardTitle>
          <CardDescription>
            Liste complète des étudiants inscrits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p>Aucun étudiant trouvé</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Prénom</th>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Matières Générales</th>
                  <th className="border p-2">Notes Générales (S1)</th>
                  <th className="border p-2">Notes Générales (S2)</th>
                  <th className="border p-2">Matières Pratiques</th>
                  <th className="border p-2">Notes Pratiques (S1)</th>
                  <th className="border p-2">Notes Pratiques (S2)</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border p-2">{student.firstname}</td>
                    <td className="border p-2">{student.lastname}</td>
                    <td className="border p-2">{student.general_subject}</td>
                    <td className="border p-2">
                      {student.general_session === 1 && (
                        <>
                          <p>Note: {student.general_grade}</p>
                          <p>Moyenne: {student.general_class_average}</p>
                          <p>Appreciation: {student.general_appreciation}</p>
                        </>
                      )}
                    </td>
                    <td className="border p-2">
                      {student.general_session === 2 && (
                        <>
                          <p>Note: {student.general_grade}</p>
                          <p>Moyenne: {student.general_class_average}</p>
                          <p>Appreciation: {student.general_appreciation}</p>
                        </>
                      )}
                    </td>
                    <td className="border p-2">{student.pratic_subject}</td>
                    <td className="border p-2">
                      {student.pratic_session === 1 && (
                        <>
                          <p>Note: {student.pratic_grade}</p>
                          <p>Moyenne: {student.pratic_class_average}</p>
                          <p>Appreciation: {student.pratic_appreciation}</p>
                        </>
                      )}
                    </td>
                    <td className="border p-2">
                      {student.pratic_session === 2 && (
                        <>
                          <p>Note: {student.pratic_grade}</p>
                          <p>Moyenne: {student.pratic_class_average}</p>
                          <p>Appreciation: {student.pratic_appreciation}</p>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/students/new')}>
            Ajouter un étudiant
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

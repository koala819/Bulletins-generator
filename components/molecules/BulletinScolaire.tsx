'use client'

import { useEffect, useRef, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import GradesTable from '../atoms/GradesTable'
import { Button } from '../ui/button'

import { useSession } from '@/context/SessionContext'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const BulletinScolaire = () => {
  const { session, sessionDates, isLoading } = useSession()
  const [topValues, setTopValues] = useState<any>({})
  const [student, setStudent] = useState<any>(null)
  const [generalSubjects, setGeneralSubjects] = useState<any>([])
  const [generalGrades, setGeneralGrades] = useState<any>([])
  const [praticSubjects, setPraticSubjects] = useState<any>([])
  const [praticGrades, setPraticGrades] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch top values
        const topResponse = await fetch('/api/top')
        const topData = await topResponse.json()
        // console.log('topData', topData)
        setTopValues(topData.data[0])

        // Fetch student data
        const studentsResponse = await fetch(
          `${process.env.API_URL}/api/students`,
        )
        const studentsData = await studentsResponse.json()
        setStudent(studentsData.data[0]) // Using the first student for now

        // Fetch grades for the current student and session
        if (studentsData.data[0]?.id) {
          const gradesResponse = await fetch(
            `${process.env.API_URL}/api/grades?studentId=${studentsData.data[0].id}&session=${session}`,
          )
          const gradesData = await gradesResponse.json()
          // console.log('gradesData', gradesData)

          setGeneralGrades(gradesData.general)
          setPraticGrades(gradesData.pratic)
        }

        // Fetch general education subjects
        const generalResponse = await fetch(
          `${process.env.API_URL}/api/general-education`,
        )
        const generalData = await generalResponse.json()
        setGeneralSubjects(generalData.data)

        // Fetch pratic education subjects
        const praticResponse = await fetch(
          `${process.env.API_URL}/api/pratic-education`,
        )
        const praticData = await praticResponse.json()
        setPraticSubjects(praticData.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [session, sessionDates])

  if (isLoading) {
    return <div>Chargement...</div>
  }

  const currentSessionDate =
    session === 1 ? sessionDates.session1 : sessionDates.session2

  const exportToPdf = () => {
    const input = pdfRef.current
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('bulletin_scolaire.pdf')
      })
    }
  }

  if (loading) {
    return <div className="text-center">Chargement...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={exportToPdf} className="mb-4 p-2 bg-blue-500 text-white">
        Exporter en PDF
      </Button>
      <Card ref={pdfRef}>
        <CardHeader className="text-center">
          <CardTitle className="text-center">
            BULLETIN D&apos;EVALUATION
          </CardTitle>
          <div className="text-sm">
            FORMATION TECHNICIEN DE MAINTENANCE AERONAUTIQUE
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="font-bold uppercase text-3xl">
                {student?.firstname} {student?.lastname}
              </p>
              <p>
                Promotion:{' '}
                <span className="font-bold">{topValues.Promotion}</span>
              </p>
              <p>
                Année: <span className="font-bold">{topValues.Année}</span>
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="flex flex-col text-center">
                FORMATION:
                <span className="font-bold">{topValues.Formation}</span>
              </p>
              <p className="flex flex-col text-center">
                Catégorie:
                <span className="font-bold">{topValues.Catégorie}</span>
              </p>
              <p className="flex flex-col text-center">
                Session:
                <span className="font-bold">
                  {session === 1 ? '1ère Phase' : '2ème Phase'}
                </span>
              </p>
              <p className="flex flex-col text-center">
                Session Date:
                <span className="font-bold">{currentSessionDate}</span>
              </p>
            </div>
          </div>

          {/* Matières géénrales */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              I. ENSEIGNEMENT GENERAL ET SCIENTIFIQUE
            </h3>
            <GradesTable subjects={generalSubjects} grades={generalGrades} />
          </div>

          {/* Matieres pratiques */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              II. ENSEIGNEMENT PRATIQUE
            </h3>
            <GradesTable subjects={praticSubjects} grades={praticGrades} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BulletinScolaire

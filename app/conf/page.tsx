'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import EducationViews from '@/components/atoms/EducationViews'
import TopViews from '@/components/atoms/TopViews'
import { Button } from '@/components/ui/button'

import { fetchTopData } from '@/lib/utils'

const Page = () => {
  const [dataTop, setDataTop] = useState<{ data: any } | null>(null)
  const [dataGeneralEducation, setDataGeneralEducation] = useState<{
    data: any
  } | null>(null)
  const [dataPraticEducation, setDataPraticEducation] = useState<{
    data: any
  } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const resultDataTop = await fetchTopData()
        setDataTop(resultDataTop)

        const resultDataGeneralEducation = await fetch(
          `${process.env.API_URL}/api/general-education`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        )
        const resultGeneral = await resultDataGeneralEducation.json()
        // console.log('resultGeneral is', resultGeneral.data)
        setDataGeneralEducation(resultGeneral)

        const resultDataPraticEducation = await fetch(
          `${process.env.API_URL}/api/pratic-education`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        )
        const resultPratic = await resultDataPraticEducation.json()
        // console.log('resultPratic is', resultPratic.data)

        setDataPraticEducation(resultPratic)
      } catch (error: any) {
        console.error('Error fetching data:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/remove-table', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        alert('Table supprimée avec succès.')
      } else {
        alert('Erreur lors de la suppression de la table.')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la table:', error)
      alert('Erreur lors de la suppression de la table.')
    }
  }

  if (loading) {
    return <div className={'text-center'}>Chargement...</div>
  }

  if (error) {
    return <div>Error loading data: {error.message!}</div>
  }

  return (
    <div>
      <ul className="flex flex-col space-y-4 justify-center items-center">
        <li className="flex flex-col justify-between bg-gray-300">
          <TopViews data={dataTop?.data} />
          <Button onClick={() => router.push('/conf/top')}>Modifier</Button>
        </li>
        <li className="flex flex-col justify-between bg-gray-300">
          <EducationViews
            data={dataGeneralEducation?.data}
            title="Enseignement Général"
          />
          <Button onClick={() => router.push('/conf/generalEducation')}>
            Modifier
          </Button>
        </li>
        <li className="flex flex-col justify-between bg-gray-300">
          <EducationViews
            data={dataPraticEducation?.data}
            title="Enseignement Pratique"
          />
          <Button onClick={() => router.push('/conf/praticEducation')}>
            Modifier
          </Button>
        </li>
        <li className="flex flex-col justify-between bg-gray-300">
          <Button variant={'destructive'} onClick={handleDelete}>
            Delete db
          </Button>
        </li>
      </ul>
    </div>
  )
}

export default Page

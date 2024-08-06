'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ListStudents = () => {
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/students`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const result = await response.json()
        console.log('data', result)

        if (result.data && result.data.length > 0) {
          const fields = [
            'nom',
            'prenom',
            'Anglais.moy',
            'Anglais.classement',
            'Anglais.appreciations',
            'Technologie professionnelle.moy',
            'Technologie professionnelle.classement',
            'Technologie professionnelle.appreciations',
            'Elec avion et IB.moy',
            'Elec avion et IB.classement',
            'Elec avion et IB.appreciations',
            // Ajoutez les autres matières ici...
          ]
          setHeaders(fields)
          setData(result.data)
        } else {
          setHeaders([])
          setData([])
        }
      } catch (error) {
        toast.error('Erreur lors de la récupération des données')
      }
    }

    fetchData()
  }, [])

  return (
    <>
      {headers.length > 0 && data.length > 0 ? (
        <Table>
          <TableCaption>Students</TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map((header: string, idx: number) => (
                <TableHead key={idx} className="text-center">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex}>
                {headers.map((header: string, cellIndex: number) => {
                  const [mainKey, subKey] = header.split('.')
                  const cellData = subKey
                    ? row[mainKey]?.[subKey]
                    : row[mainKey]
                  return (
                    <TableCell key={cellIndex} className="text-center">
                      {cellData}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-red-600">RIEN A AFFICHER</div>
      )}
    </>
  )
}

export default ListStudents

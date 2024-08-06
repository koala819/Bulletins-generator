'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import TopViews from '@/components/atoms/TopViews'
import { Button } from '@/components/ui/button'

import { fetchTopData } from '@/lib/utils'

const Page = () => {
  const [data, setData] = useState<{ data: any } | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetchTopData()
        setData(result)
      } catch (error: any) {
        console.error('Error fetching data:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
          <TopViews data={data?.data} />
          <Button onClick={() => router.push('/conf/top')}>Modifier</Button>
          {/* <a href="/conf/top">top</a> */}
        </li>
        <li className="block">
          <a href="/admin/item1">Item 1</a>
        </li>
        <li>
          <a href="/admin/item2">Item 2</a>
        </li>
      </ul>
    </div>
  )
}

export default Page

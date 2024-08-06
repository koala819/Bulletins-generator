'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useRouter } from 'next/navigation'

import { FormDataTopConfig } from '@/types/models'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { fetchTopData } from '@/lib/utils'

export function TopConfig() {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const form = useForm<FormDataTopConfig>({
    defaultValues: {
      fields: [
        { name: 'Promotion', value: '' },
        { name: 'Année', value: '' },
        { name: 'Formation', value: '' },
        { name: 'Catégorie', value: '' },
        { name: 'dates-Session1', value: '' },
        { name: 'dates-Session2', value: '' },
      ],
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'fields',
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await fetchTopData()
        if (result?.data?.length > 0) {
          form.reset({
            fields: [
              { name: 'Promotion', value: result.data[0].Promotion },
              { name: 'Année', value: result.data[0].Année },
              { name: 'Formation', value: result.data[0].Formation },
              { name: 'Catégorie', value: result.data[0].Catégorie },
              {
                name: 'dates-Session1',
                value: result.data[0]['dates-Session1'],
              },
              {
                name: 'dates-Session2',
                value: result.data[0]['dates-Session2'],
              },
            ],
          })
        }
      } catch (error: any) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const onSubmit = async (data: FormDataTopConfig) => {
    const confirm = window.confirm(
      'Cette action détruira toutes les données existantes et les remplacera par celles saisies. Voulez-vous continuer ?',
    )
    if (!confirm) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${process.env.API_URL}/api/top`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.fields),
      })
      if (response.ok) {
        toast.success('Configuration sauvegardée avec succès')
        router.push('/conf')
      } else {
        toast.error('Erreur lors de la sauvegarde de la configuration')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de la configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((fieldValue, index) => (
          <div
            key={index}
            className="flex justify-center items-center space-x-2 mt-8"
          >
            <FormItem>
              <FormLabel>{fieldValue.name}</FormLabel>
              <FormField
                control={form.control}
                name={`fields.${index}.value`}
                render={({ field }) => (
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                )}
              />
              <FormMessage />
            </FormItem>
          </div>
        ))}
        <div className="flex justify-between mx-8 py-4">
          <Button
            type="button"
            variant={'destructive'}
            onClick={() => router.push('/conf')}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={() => console.log('form.getValues', form.getValues())}
            disabled={loading}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

'use client'

import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useRouter } from 'next/navigation'

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

type FormData = {
  fields: {
    name: string
    value: string
  }[]
}

export function TopConfig() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      fields: [
        { name: 'Promotion', value: '' },
        { name: 'Année', value: '' },
        { name: 'Formation', value: '' },
        { name: 'Catégorie', value: '' },
        { name: 'Session', value: '' },
        { name: 'dates-Session', value: '' },
      ],
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'fields',
  })

  const onSubmit = async (data: FormData) => {
    const confirm = window.confirm(
      'Cette action détruira toutes les données existantes et les remplacera par celles saisies. Voulez-vous continuer ?',
    )
    if (!confirm) {
      return
    }

    console.log('data is', data.fields)
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/student-config`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.fields),
        },
      )
      if (response.ok) {
        toast.success('Configuration sauvegardée avec succès')
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

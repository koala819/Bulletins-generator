'use client'

import { useState } from 'react'
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

export function GeneralEducationConfig() {
  const [loading, setLoading] = useState<boolean>(false)
  const [tempNumSubjects, setTempNumSubjects] = useState<number | null>(null)
  const [numSubjects, setNumSubjects] = useState<number | null>(null)

  const router = useRouter()

  const form = useForm<FormDataTopConfig>({
    defaultValues: {
      fields: [],
    },
  })

  const { append } = useFieldArray({
    control: form.control,
    name: 'fields',
  })

  const generateFields = () => {
    setNumSubjects(tempNumSubjects)
    form.reset({ fields: [] })
    for (let i = 0; i < tempNumSubjects!; i++) {
      append({ name: `Matière ${i + 1}`, value: '' })
      append({ name: `Module ${i + 1}`, value: '' })
    }
  }

  const onSubmit = async (data: FormDataTopConfig) => {
    const confirm = window.confirm(
      'Cette action détruira toutes les données existantes et les remplacera par celles saisies. Voulez-vous continuer ?',
    )
    if (!confirm) {
      return
    }
    console.log('data', data)
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/general-education`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data.fields),
        },
      )
      if (response.ok) {
        toast.success('Configuration sauvegardée avec succès')
        // router.push('/conf/top')
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
        {numSubjects === null ? (
          <div className="flex justify-between items-center mx-8 py-4">
            <span>Combien de matières</span>
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  onChange={(e) => setTempNumSubjects(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button
              type="button"
              onClick={generateFields}
              disabled={tempNumSubjects === null || tempNumSubjects <= 0}
            >
              Générer
            </Button>
          </div>
        ) : (
          [...Array(numSubjects)].map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 mb-4 flex flex-col md:flex-row md:space-x-4 items-center"
            >
              <FormItem className="w-full md:w-1/2">
                <FormLabel>{`Matière ${index + 1}`}</FormLabel>
                <FormField
                  control={form.control}
                  name={`fields.${index * 2}.value`}
                  render={({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Nom de la matière" />
                    </FormControl>
                  )}
                />
                <FormMessage />
              </FormItem>
              <FormItem className="w-full md:w-1/2">
                <FormLabel>{`Module ${index + 1}`}</FormLabel>
                <FormField
                  control={form.control}
                  name={`fields.${index * 2 + 1}.value`}
                  render={({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Nom du module" />
                    </FormControl>
                  )}
                />
                <FormMessage />
              </FormItem>
            </div>
          ))
        )}
        <div className="flex justify-between mx-8 py-4">
          <Button
            type="button"
            variant={'destructive'}
            onClick={() => router.push('/conf')}
          >
            Annuler
          </Button>
          {numSubjects !== null && (
            <Button type="submit" disabled={loading}>
              {loading ? 'Sauvegarde...' : 'Créer'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

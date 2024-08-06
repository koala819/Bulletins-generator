'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { useRouter } from 'next/navigation'

import { StudentsProps } from '@/types/models'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export function StudentForm({ title, description }: StudentsProps) {
  const [loadingAfterSubmit, setLoadingAfterSubmit] = useState<boolean>(false)
  const router = useRouter()

  const FormSchema = z.object({
    firstname: z
      .string()
      .min(2, { message: 'Le prénom doit contenir 2 caractères minimum.' }),
    lastname: z
      .string()
      .min(2, { message: 'Le nom doit contenir 2 caractères minimum.' }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
    },
  })

  async function onSubmit(values: any) {
    setLoadingAfterSubmit(true)

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    }

    const data = await fetch(`${process.env.API_URL}/api/students`, options)

    if (data) {
      if (data.status !== 200) {
        toast.error(data.statusText)
      } else {
        toast.success('Etudiant créé avec succès !')
        router.push('/')
        setLoadingAfterSubmit(false)
      }
    }
  }

  if (loadingAfterSubmit) {
    return (
      <LoadingSpinner
        text={"Enregistrement de l'élève en base, veuillez patienter"}
      />
    )
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Prénom */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Nom */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Créer l&apos;élève
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

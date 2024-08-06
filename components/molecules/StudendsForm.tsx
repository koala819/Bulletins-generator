'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

// import { useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export interface StudentsProps {
  title: string
  description: string
}

export function StudentsForm({ title, description }: StudentsProps) {
  const [loadingAfterSubmit, setLoadingAfterSubmit] = useState<boolean>(false)
  // const router = useRouter()

  const FormSchema = z.object({
    firstname: z
      .string()
      .min(2, { message: 'Le prénom doit contenir 2 caractères minimum.' }),
    lastname: z
      .string()
      .min(2, { message: 'Le nom doit contenir 2 caractères minimum.' }),
    promotion: z
      .string()
      .min(2, { message: 'La promotion doit contenir 2 caractères minimum.' }),
    year: z
      .string()
      .min(4, { message: "L'année doit contenir 4 caractères minimum." }),
    formation: z
      .string()
      .min(3, { message: 'La formation doit contenir 3 caractères minimum.' }),
    category: z
      .string()
      .min(3, { message: 'La categorie doit contenir 3 caractères minimum.' }),
    session: z
      .string()
      .min(1, { message: 'Veuillez sélectionner une session.' }),
    dateSession: z
      .string()
      .min(4, { message: "L'année doit contenir 4 caractères minimum." }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      promotion: '',
      year: '',
      formation: '',
      category: '',
      session: '',
      dateSession: '',
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
        // router.push('/')
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

                {/* Promotion */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="promotion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotion</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez la promotion" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Année */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Année</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez l'année'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Formation */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="formation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formation</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez la formation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez la categorie" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Session */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          //   disabled={!selectedTeacher}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="choisir une Session" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem key={'session1'} value={'session1'}>
                              1ère Phase
                            </SelectItem>
                            <SelectItem key={'session2'} value={'session2'}>
                              2ème Phase
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dates de la session */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="dateSession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dates de la session</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez les dates de la session"
                            {...field}
                          />
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

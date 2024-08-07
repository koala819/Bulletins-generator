'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useSession } from '@/context/SessionContext'
import { z } from 'zod'

const FormSchema = z.object({
  subject: z.string({
    required_error: 'Please select a subject',
  }),
  grades: z.record(z.string(), z.number().int()),
})

const GradeEntry = () => {
  const [generalSubjects, setGeneralSubjects] = useState<any[]>([])
  const [praticSubjects, setPraticSubjects] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const { session } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      subject: '',
      grades: {},
    },
  })

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const generalRes = await fetch(
          `${process.env.API_URL}/api/general-education`,
        )
        const generalData = await generalRes.json()
        const praticRes = await fetch(
          `${process.env.API_URL}/api/pratic-education`,
        )
        const praticData = await praticRes.json()
        setGeneralSubjects(generalData.data)
        setPraticSubjects(praticData.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error)
      }
    }
    fetchSubjects()
  }, [])

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${process.env.API_URL}/api/students`)
        const data = await res.json()
        setStudents(data.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error)
      }
    }
    fetchStudents()
  }, [])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    // console.log('data', data)
    setLoading(true)
    const subjectId = parseInt(data.subject.split('-')[1])
    const subjectType = data.subject.split('-')[0]

    for (const [studentId, grade] of Object.entries(data.grades)) {
      const payload = {
        studentId: parseInt(studentId),
        subjectId,
        session,
        grade,
        type: subjectType,
      }

      // console.log('payload', payload)

      try {
        const res = await fetch(`${process.env.API_URL}/api/grades`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          console.error('Failed to update grade:', await res.text())
        } else {
          toast.success('Notes enregistrées avec succès !')
          form.reset()
          router.push('/')
        }
      } catch (error) {
        console.error('Error updating grade:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return <div className="texte-center">Enregistrement des notes ...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sélectionnez une matière</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedSubject(value)
                  }}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="-- Sélectionnez une matière --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general-header" disabled>
                      <strong>Matières Générales</strong>
                    </SelectItem>
                    {generalSubjects.map((subject) => (
                      <SelectItem
                        key={`general-${subject.id}`}
                        value={`general-${subject.id}`}
                      >
                        {subject.name} ({subject.module})
                      </SelectItem>
                    ))}
                    <SelectItem value="pratic-header" disabled>
                      <strong>Matières Pratiques</strong>
                    </SelectItem>

                    {praticSubjects.map((subject) => (
                      <SelectItem
                        key={`pratic-${subject.id}`}
                        value={`pratic-${subject.id}`}
                      >
                        {subject.name} ({subject.module})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedSubject && (
          <div>
            <h2>Liste des élèves</h2>
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between my-2"
              >
                <span>
                  {student.firstname} {student.lastname}
                </span>
                <FormField
                  control={form.control}
                  name={`grades.${student.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>-- Note --</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(
                              (n) => (
                                <SelectItem key={n} value={`${n}`}>
                                  {n}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormControl>
                  <select
                    value={grades[student.id] || ''}
                    onChange={(e) =>
                      handleGradeChange(student.id, Number(e.target.value))
                    }
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="">-- Note --</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </FormControl> */}
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button
                variant="destructive"
                onClick={() => setSelectedSubject(null)}
              >
                Annuler
              </Button>
              <Button type="submit">Valider</Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}

export default GradeEntry

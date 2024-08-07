import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const GradesTable = ({ subjects, grades }: { subjects: any; grades: any }) => {
  const calculateSubjectAverage = (grades: any) => {
    if (grades.length === 0) return '-'
    const sum = grades.reduce(
      (acc: number, grade: { grade: string }) => acc + parseFloat(grade.grade),
      0,
    )
    return (sum / grades.length).toFixed(2)
  }

  const calculateClassAverage = (grades: any) => {
    if (grades.length === 0) return '-'
    const sum = grades.reduce(
      (acc: number, grade: { class_average: string }) =>
        acc + parseFloat(grade.class_average),
      0,
    )
    return (sum / grades.length).toFixed(2)
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Matières</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Moyenne</TableHead>
          <TableHead>Moy. Classe</TableHead>
          <TableHead>Appréciations</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject: any, index: number) => {
          const subjectGrades = grades.filter(
            (grade: any) => grade.name === subject.name,
          )
          const subjectAverage = calculateSubjectAverage(subjectGrades)
          const classAverage = calculateClassAverage(subjectGrades)

          return (
            <TableRow key={index}>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.module}</TableCell>
              <TableCell>
                {subjectGrades.map((grade: any, i: number) => (
                  <div key={i}>{grade.grade}</div>
                ))}
              </TableCell>
              <TableCell>{subjectAverage}</TableCell>
              <TableCell>{classAverage}</TableCell>

              <TableCell>
                {subjectGrades.map((grade: any, i: number) => (
                  <div key={i}>{grade.appreciation}</div>
                ))}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default GradesTable

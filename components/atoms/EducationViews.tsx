import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function EducationViews({
  data,
  title,
}: {
  data: any
  title: string
}) {
  return (
    <Table>
      <TableCaption>{title}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Matière</TableHead>
          <TableHead className="text-center">Module</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((value: { name: string; module: string }, index: number) => (
          <TableRow key={index}>
            <TableCell className="text-center">{value.name}</TableCell>
            <TableCell className="text-center">{value.module}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function GeneralEducationViews({ data }: { data: any }) {
  // Extract the keys for the subjects and modules
  const matiereKeys = Object.keys(data[0]).filter((key) =>
    key.startsWith('Matière'),
  )
  const moduleKeys = Object.keys(data[0]).filter((key) =>
    key.startsWith('Module'),
  )

  return (
    <Table>
      <TableCaption>Enseignements Général & Scientifique</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Matière</TableHead>
          <TableHead className="text-center">Module</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matiereKeys.map((matiereKey, index) => (
          <TableRow key={index}>
            <TableCell className="text-center">{data[0][matiereKey]}</TableCell>
            <TableCell className="text-center">
              {data[0][moduleKeys[index]]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

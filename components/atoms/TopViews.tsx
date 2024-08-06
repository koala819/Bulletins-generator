import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TopViews({ data }: { data: any }) {
  const headers =
    data && data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== 'id')
      : []

  return (
    <Table>
      <TableCaption>Valeurs partie TOP </TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header, idx) => (
            <TableHead key={idx} className="text-center">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: any, rowIndex: number) => (
          <TableRow key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <TableCell key={cellIndex} className="text-center">
                {row[header]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

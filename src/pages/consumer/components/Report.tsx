import { Table } from "lucide-react"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { useLanguage } from "../../organizer/components/LanguageContext"


export default function ReportsPage() {
  const { t } = useLanguage()

  const columns = [
    { key: "file", name: t.reports.columns.file },
    { key: "createdAt", name: t.reports.columns.createdAt },
    { key: "creator", name: t.reports.columns.creator },
    { key: "status", name: t.reports.columns.status },
    { key: "actions", name: t.reports.columns.actions },
  ]

  return (
    <div className="p-6">
      <div className="bg-[#1E1E1E] rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-gray-400">
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} className="h-96">
               
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


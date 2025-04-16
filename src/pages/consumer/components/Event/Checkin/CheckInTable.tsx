import { Badge } from "../../../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";

interface Ticket {
  type: string;
  price: number;
  total: number;
  checkedIn: number;
}

interface TicketTableProps {
  data: Ticket[];
}

export default function TicketTable({ data }: TicketTableProps) {
  return (
    <Card className="w-full bg-background h-auto text-foreground shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle>Chi tiết vé</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại vé</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Đã check-in</TableHead>
              <TableHead>Tỉ lệ check-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((ticket, index) => {
              const ratio =
                ticket.total > 0
                  ? ((ticket.checkedIn / ticket.total) * 100).toFixed(1)
                  : "0.0";
              return (
                <TableRow key={index}>
                  <TableCell>{ticket.type}</TableCell>
                  <TableCell>{ticket.price.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {ticket.checkedIn}/{ticket.total}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={
                        parseFloat(ratio) >= 80
                          ? "bg-green-500"
                          : parseFloat(ratio) >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {ratio}%
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

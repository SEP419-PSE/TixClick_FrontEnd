import { useState } from "react";
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
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Badge } from "../../../../../components/ui/badge";
import { Search } from "lucide-react";
import { TransactionResponse } from "../../../../../interface/company/Transaction";
import { formatDateVietnamese } from "../../../../../lib/utils";

type Props = {
  transactions?: TransactionResponse[];
};

export function OrderList({ transactions }: Props) {
  console.log(JSON.stringify(transactions, null, 2));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = transactions?.filter((tx) => {
    const matchesSearch =
      tx.accountName.toLowerCase().includes(search.toLowerCase()) ||
      tx.transactionCode.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      tx.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-background text-foreground shadow-md rounded-2xl border">
      <CardHeader>
        <CardTitle>Danh sách giao dịch</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm theo tên hoặc mã đơn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            onValueChange={(value) => setStatusFilter(value)}
            value={statusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="success">SUCCESS</SelectItem>
              <SelectItem value="failed">FAILED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại giao dịch</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData !== undefined ? (
                filteredData?.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>{tx.transactionCode}</TableCell>
                    <TableCell className="font-medium">
                      {tx.accountName}
                    </TableCell>
                    <TableCell>{tx.transactionType}</TableCell>
                    <TableCell
                      className={
                        tx.amount < 0 ? "text-red-500" : "text-green-600"
                      }
                    >
                      {tx.amount.toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell>
                      {formatDateVietnamese(tx.transactionDate.toString())}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          tx.status === "SUCCESS"
                            ? "default"
                            : tx.status === "FAILED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không tìm thấy giao dịch phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

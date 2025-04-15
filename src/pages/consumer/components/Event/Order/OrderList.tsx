"use client";

import { useMemo, useState } from "react";
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
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Search } from "lucide-react";
import { Label } from "../../../../../components/ui/label";

const transactions = [
  {
    id: "1",
    code: "ORD001",
    name: "Nguyễn Văn A",
    type: "Mua vé VIP",
    amount: 1500000,
    date: "2025-04-14 08:30",
    status: "Hoàn tất",
  },
  {
    id: "2",
    code: "ORD002",
    name: "Trần Thị B",
    type: "Mua vé thường",
    amount: 500000,
    date: "2025-04-14 09:15",
    status: "Hoàn tất",
  },
  {
    id: "3",
    code: "ORD003",
    name: "Phạm Minh C",
    type: "Hoàn tiền vé",
    amount: -1000000,
    date: "2025-04-13 17:22",
    status: "Đã hoàn",
  },
];

export function OrderList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredData = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch =
        tx.name.toLowerCase().includes(search.toLowerCase()) ||
        tx.code.toLowerCase().includes(search.toLowerCase());
      const statusMatch = statusFilter ? tx.status === statusFilter : true;
      const typeMatch = typeFilter ? tx.type === typeFilter : true;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [search, statusFilter, typeFilter]);

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
              placeholder="Tìm kiếm theo tên hoặc mã đơn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-3">
            <Select
              onValueChange={(value) =>
                setStatusFilter(value === "all" ? "" : value)
              }
              value={statusFilter || "all"}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Hoàn tất">Hoàn tất</SelectItem>
                <SelectItem value="Đã hoàn">Đã hoàn</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                setTypeFilter(value === "all" ? "" : value)
              }
              value={typeFilter || "all"}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Mua vé VIP">Mua vé VIP</SelectItem>
                <SelectItem value="Mua vé thường">Mua vé thường</SelectItem>
                <SelectItem value="Hoàn tiền vé">Hoàn tiền vé</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              {filteredData.length > 0 ? (
                filteredData.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.code}</TableCell>
                    <TableCell className="font-medium">{tx.name}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell
                      className={
                        tx.amount < 0 ? "text-red-500" : "text-green-600"
                      }
                    >
                      {tx.amount.toLocaleString("vi-VN")}₫
                    </TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          tx.status === "Hoàn tất"
                            ? "default"
                            : tx.status === "Đang xử lý"
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

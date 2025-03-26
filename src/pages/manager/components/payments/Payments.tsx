import { ChevronDown, ChevronRight, Download, FileText, MoreHorizontal, Search, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent } from "../../../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Progress } from "../../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Textarea } from "../../../../components/ui/textarea"
import { AccountGroup, Payments } from "../../../../interface/manager/Payment"
import { ManagerHeader } from "../ManagerHeader"

export default function PaymentsPage() {
  const [paymentGroups, setPaymentGroups] = useState<AccountGroup[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payments | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const mockPayments: Payments[] = [
    {
      paymentId: 1,
      paymentMethod: "Credit Card",
      amount: 1200000,
      paymentDate: "2023-06-15",
      status: "Paid",
      orderCode: "ORD-001",
      orderId: 1001,
      accountId: 101,
    },
    {
      paymentId: 2,
      paymentMethod: "Bank Transfer",
      amount: 850000,
      paymentDate: "2023-06-20",
      status: "Pending",
      orderCode: "ORD-002",
      orderId: 1002,
      accountId: 101,
    },
    {
      paymentId: 3,
      paymentMethod: "PayPal",
      amount: 500000,
      paymentDate: "2023-06-25",
      status: "Partial",
      orderCode: "ORD-003",
      orderId: 1003,
      accountId: 102,
    },
    {
      paymentId: 4,
      paymentMethod: "Wire Transfer",
      amount: 2500000,
      paymentDate: "2023-06-30",
      status: "Paid",
      orderCode: "ORD-004",
      orderId: 1004,
      accountId: 103,
    },
    {
      paymentId: 5,
      paymentMethod: "Credit Card",
      amount: 750000,
      paymentDate: "2023-07-05",
      status: "Overdue",
      orderCode: "ORD-005",
      orderId: 1005,
      accountId: 102,
    },
    {
      paymentId: 6,
      paymentMethod: "Bank Transfer",
      amount: 1500000,
      paymentDate: "2023-07-10",
      status: "Paid",
      orderCode: "ORD-006",
      orderId: 1006,
      accountId: 103,
    },
  ]

  // const fetchPaymentList = async () => {
  //   try {
  //     const res: any = await managerApi.getAllPayment();
  //     console.log("Contract List:", res.data.result);
  //     if (res.data.result && res.data.result.length > 0) {
  //       setPayments(res.data.result);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contract:", error);
  //     toast.error("Failed to fetch contract");
  //   }
  // };
  
  // useEffect(() => {
  //   const initUseEffect = async () => {
  //     await fetchPaymentList();
  //   };
  //   initUseEffect();
  // }, []);
  

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = mockPayments

        const groupedByAccount: { [key: number]: Payments[] } = {}
        data.forEach((payment) => {
          if (!groupedByAccount[payment.accountId]) {
            groupedByAccount[payment.accountId] = []
          }
          groupedByAccount[payment.accountId].push(payment)
        })

        const groups: AccountGroup[] = Object.keys(groupedByAccount).map((accountId) => ({
          accountId: Number.parseInt(accountId),
          payments: groupedByAccount[Number.parseInt(accountId)],
          isExpanded: false,
        }))

        setPaymentGroups(groups)
      } catch (error) {
        console.error("Error fetching payments:", error)
        toast.error("Failed to fetch payments")
      }
    }

    fetchPayments()
  }, [])

  const toggleGroupExpansion = (accountId: number) => {
    setPaymentGroups((prevGroups) =>
      prevGroups.map((group) => (group.accountId === accountId ? { ...group, isExpanded: !group.isExpanded } : group)),
    )
  }

  const handleSendReminder = () => {
    if (selectedPayment) {
      console.log(`Sending reminder for payment ${selectedPayment.paymentId}: ${reminderMessage}`)
      toast.success("Reminder Sent", {
        description: `A payment reminder has been sent for order ${selectedPayment.orderCode}.`,
      })
      setIsReminderModalOpen(false)
      setReminderMessage("")
    }
  }

  const handleDownloadInvoice = (payment: Payments) => {
    console.log(`Downloading invoice for ${payment.orderCode}`)
    toast.success("Invoice Downloaded", {
      description: `Invoice for order ${payment.orderCode} has been downloaded.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500">Paid</span>;
      case "Partial":
        return <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-500">Partial</span>;
      case "Pending":
        return <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-500">Pending</span>;
      case "Overdue":
        return <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">Overdue</span>;
      default:
        return <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-500">Unknown</span>;
    }
  };
  

  const filteredGroups = paymentGroups
    .map((group) => {
      const filteredPayments = group.payments.filter((payment) => {
        const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase()
        const matchesSearch =
          searchQuery === "" ||
          payment.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesStatus && matchesSearch
      })

      return {
        ...group,
        payments: filteredPayments,
      }
    })
    .filter((group) => group.payments.length > 0) 

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <ManagerHeader heading="Payments" text="View all payments" />
      

      <main className="p-6">
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Search className="text-[#FF8A00]" />
                <Input
                  className="w-[300px] bg-[#2A2A2A] border-[#3A3A3A] text-white focus:border-[#FF8A00] focus:ring-[#FF8A00]/10"
                  placeholder="Search by order code or payment method..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-[#2A2A2A] border-[#3A3A3A] text-white focus:ring-[#FF8A00]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border border-[#2A2A2A] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#2A2A2A] hover:bg-[#333333]">
                    <TableHead className="text-white w-[50px]"></TableHead>
                    <TableHead className="text-white">Account ID</TableHead>
                    <TableHead className="text-white">Total Payments</TableHead>
                    <TableHead className="text-white">Total Amount</TableHead>
                    <TableHead className="text-white">Latest Payment</TableHead>
                    <TableHead className="text-white text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.map((group) => (
                    <>
                      <TableRow
                        key={group.accountId}
                        className="border-[#333333] hover:bg-[#2A2A2A] cursor-pointer"
                        onClick={() => toggleGroupExpansion(group.accountId)}
                      >
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-[#FF8A00]">
                            {group.isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-white">Account #{group.accountId}</TableCell>
                        <TableCell className="text-white">{group.payments.length}</TableCell>
                        <TableCell className="text-white">
                          {formatCurrency(group.payments.reduce((sum, payment) => sum + payment.amount, 0))}
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(
                            Math.max(...group.payments.map((p) => new Date(p.paymentDate).getTime())),
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right text-white">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer hover:bg-[#333333] ">
                                View account details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-[#333333] ]">
                                Export payment history
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {group.isExpanded &&
                        group.payments.map((payment) => (
                          <TableRow
                            key={payment.paymentId}
                            className="border-[#333333] bg-[#1E1E1E] hover:bg-[#2A2A2A]"
                          >
                            <TableCell></TableCell>
                            <TableCell className="pl-10 flex items-center">
                              <FileText className="h-4 w-4 text-[#FF8A00] mr-2" />
                              <span className="text-gray-300">{payment.orderCode}</span>
                            </TableCell>
                            <TableCell className="text-gray-300">{payment.paymentMethod}</TableCell>
                            <TableCell className="text-gray-300">{formatCurrency(payment.amount)}</TableCell>
                            <TableCell className="text-gray-300">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                              <div className="mt-1">{getStatusBadge(payment.status)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                    onClick={() => {
                                      setSelectedPayment(payment)
                                      setIsPaymentModalOpen(true)
                                    }}
                                  >
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                    onClick={() => {
                                      setSelectedPayment(payment)
                                      setIsReminderModalOpen(true)
                                    }}
                                  >
                                    Send payment reminder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer hover:bg-[#333333] focus:bg-[#333333]"
                                    onClick={() => handleDownloadInvoice(payment)}
                                  >
                                    Download invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                                  <DropdownMenuItem className="text-red-500 cursor-pointer hover:bg-[#333333] focus:bg-[#333333]">
                                    Mark as void
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}

                  {filteredGroups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                        No payments found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 text-[#FF8A00] mr-2" />
              Payment Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View and manage the details of the selected payment.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#2A2A2A]">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-[#333333] data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-[#333333] data-[state=active]:text-white"
                >
                  Payment History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#2A2A2A] rounded-md">
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment ID</p>
                    <p className="font-medium">{selectedPayment.paymentId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Order Code</p>
                    <p className="font-medium">{selectedPayment.orderCode}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment Method</p>
                    <p className="font-medium">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Amount</p>
                    <p className="font-medium text-[#FF8A00]">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Payment Date</p>
                    <p className="font-medium">{new Date(selectedPayment.paymentDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Status</p>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Order ID</p>
                    <p className="font-medium">{selectedPayment.orderId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400">Account ID</p>
                    <p className="font-medium">{selectedPayment.accountId}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="p-4 bg-[#2A2A2A] rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Payment Timeline</h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-32 text-right mr-4 text-sm text-gray-400">
                        {new Date(selectedPayment.paymentDate).toLocaleDateString()}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full ${
                          selectedPayment.status === "Paid"
                            ? "bg-green-500"
                            : selectedPayment.status === "Pending"
                              ? "bg-blue-500"
                              : selectedPayment.status === "Partial"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }`}
                      ></div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium">Payment {selectedPayment.status}</p>
                        <p className="text-sm text-gray-400">
                          {selectedPayment.paymentMethod} - {formatCurrency(selectedPayment.amount)}
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-gray-400 mb-2">Payment Progress</p>
                    <Progress
                      value={
                        selectedPayment.status === "Paid"
                          ? 100
                          : selectedPayment.status === "Partial"
                            ? 50
                            : selectedPayment.status === "Pending"
                              ? 25
                              : 0
                      }
                      className="h-2 bg-[#333333]"
                      // indicatorClassName="bg-[#FF8A00]"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="border-[#3A3A3A] hover:bg-[#2A2A2A] hover:text-white"
            >
              Close
            </Button>
            <Button
              onClick={() => handleDownloadInvoice(selectedPayment!)}
              className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white"
            >
              <Download className="h-4 w-4 mr-2" /> Download Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="h-5 w-5 text-[#FF8A00] mr-2" />
              Send Payment Reminder
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a reminder for the payment to the account holder.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-[#2A2A2A] rounded-md">
                <p className="text-sm text-gray-400">Order Code</p>
                <p className="font-medium">{selectedPayment.orderCode}</p>
                <div className="mt-2 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-medium text-[#FF8A00]">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Status</p>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Reminder Message</label>
                <Textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white focus:border-[#FF8A00] focus:ring-[#FF8A00]/10 min-h-[120px]"
                  placeholder={`Dear Account #${selectedPayment.accountId},\n\nThis is a friendly reminder about your pending payment for order ${selectedPayment.orderCode}.\n\nPlease complete your payment at your earliest convenience.`}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsReminderModalOpen(false)}
              className="border-[#3A3A3A] hover:bg-[#2A2A2A] hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSendReminder} className="bg-[#FF8A00] hover:bg-[#FF9A20] text-white">
              <Send className="h-4 w-4 mr-2" /> Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


import { Badge, MoreHorizontal, Search, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Progress } from "../../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Textarea } from "../../../../components/ui/textarea"
import { ManagerPayment } from "../../../../interface/manager/Payment"
import { ManagerHeader } from "../ManagerHeader"

export default function PaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      invoiceNumber: "INV-001",
      company: "Acme Inc",
      totalAmount: 10000,
      paidAmount: 10000,
      remainingAmount: 0,
      date: "2023-06-15",
      dueDate: "2023-07-15",
      status: "Paid",
      paymentMethod: "Credit Card",
      currency: "USD",
      paymentType: "Full Payment",
      installments: [],
    },
    {
      id: 2,
      invoiceNumber: "INV-002",
      company: "Globex Corporation",
      totalAmount: 25000,
      paidAmount: 12500,
      remainingAmount: 12500,
      date: "2023-06-20",
      dueDate: "2023-09-20",
      status: "Partial",
      paymentMethod: "Bank Transfer",
      currency: "EUR",
      paymentType: "Installments",
      installments: [
        { date: "2023-06-20", amount: 12500 },
        { date: "2023-09-20", amount: 12500, status: "Pending" },
      ],
    },
    {
      id: 3,
      invoiceNumber: "INV-003",
      company: "Initech",
      totalAmount: 15000,
      paidAmount: 5000,
      remainingAmount: 10000,
      date: "2023-06-25",
      dueDate: "2023-09-25",
      status: "Partial",
      paymentMethod: "PayPal",
      currency: "USD",
      paymentType: "Installments",
      installments: [
        { date: "2023-06-25", amount: 5000 },
        { date: "2023-07-25", amount: 5000, status: "Pending" },
        { date: "2023-08-25", amount: 5000, status: "Pending" },
      ],
    },
    {
      id: 4,
      invoiceNumber: "INV-004",
      company: "Umbrella Corporation",
      totalAmount: 50000,
      paidAmount: 50000,
      remainingAmount: 0,
      date: "2023-06-30",
      dueDate: "2023-07-30",
      status: "Paid",
      paymentMethod: "Wire Transfer",
      currency: "GBP",
      paymentType: "Full Payment",
      installments: [],
    },
    {
      id: 5,
      invoiceNumber: "INV-005",
      company: "Soylent Corp",
      totalAmount: 30000,
      paidAmount: 0,
      remainingAmount: 30000,
      date: "2023-07-05",
      dueDate: "2023-08-05",
      status: "Pending",
      paymentMethod: "Credit Card",
      currency: "USD",
      paymentType: "Full Payment",
      installments: [],
    },
  ])

  const [newPayment, setNewPayment] = useState({
    invoiceNumber: "",
    company: "",
    totalAmount: "",
    date: "",
    dueDate: "",
    status: "Pending",
    paymentMethod: "",
    currency: "USD",
    paymentType: "Full Payment",
  })

  const [selectedPayment, setSelectedPayment] = useState<ManagerPayment>({
    invoiceNumber: "",
    company: "",
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    date: "",
    dueDate: "",
    status: "",
    paymentMethod: "",
    currency: "",
    paymentType: "",
    installments: [
        {
            amount: 0,
            dueDate: "",
            status: "",
        },
    ],
  })
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")

  console.log(setPayments);
  console.log(newPayment);
  console.log(setNewPayment);
  console.log(setSelectedPayment);



  // const handleAddPayment = () => {
  //   // const paymentToAdd = {
  //   //   ...newPayment,
  //   //   id: payments.length + 1,
  //   //   totalAmount: Number.parseFloat(newPayment.totalAmount),
  //   //   paidAmount: 0,
  //   //   remainingAmount: Number.parseFloat(newPayment.totalAmount),
  //   //   installments: newPayment.paymentType === "Installments" ? [] : undefined,
  //   // }
  //   // setPayments([...payments, paymentToAdd])
  //   console.log(setSelectedPayment)
  //   console.log(setPayments)
  //   setNewPayment({
  //     invoiceNumber: "",
  //     company: "",
  //     totalAmount: "",
  //     date: "",
  //     dueDate: "",
  //     status: "Pending",
  //     paymentMethod: "",
  //     currency: "USD",
  //     paymentType: "Full Payment",
  //   })
  //   toast.success(
  //     "Payment Added",{
  //     description: "The new payment has been successfully added.",
  //   })
  // }

  const handleSendReminder = () => {
    console.log(`Sending reminder for invoice ${selectedPayment.invoiceNumber}: ${reminderMessage}`)
    toast.success(
      "Reminder Sent",{
      description: `A payment reminder has been sent for invoice ${selectedPayment.invoiceNumber}.`,
    })
    setIsReminderModalOpen(false)
    setReminderMessage("")
  }

  const handleDownloadInvoice = (payment:any) => {
    console.log(`Downloading invoice for ${payment.invoiceNumber}`)
    toast.success(
      "Invoice Downloaded",{
      description: `Invoice ${payment.invoiceNumber} has been downloaded.`,
    })
  }

  const getStatusBadge = (status:any) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500/20 text-green-500">Paid</Badge>
      case "Partial":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Partial</Badge>
      case "Pending":
        return <Badge className="bg-blue-500/20 text-blue-500">Pending</Badge>
      case "Overdue":
        return <Badge className="bg-red-500/20 text-red-500">Overdue</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <ManagerHeader heading="Payments" text="Manage and track all payments" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input className="w-[300px] bg-[#2A2A2A] text-white" placeholder="Search payments..." />
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="installments">Installments</SelectItem>
              </SelectContent>
            </Select>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00B14F] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2A2A2A] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Payment</DialogTitle>
                  <DialogDescription>Enter the details of the new payment here.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="invoiceNumber" className="text-right">
                      Invoice Number
                    </Label>
                    <Input
                      id="invoiceNumber"
                      value={newPayment.invoiceNumber}
                      onChange={(e) => setNewPayment({ ...newPayment, invoiceNumber: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={newPayment.company}
                      onChange={(e) => setNewPayment({ ...newPayment, company: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalAmount" className="text-right">
                      Total Amount
                    </Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={newPayment.totalAmount}
                      onChange={(e) => setNewPayment({ ...newPayment, totalAmount: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newPayment.dueDate}
                      onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentMethod" className="text-right">
                      Payment Method
                    </Label>
                    <Select onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currency" className="text-right">
                      Currency
                    </Label>
                    <Select onValueChange={(value) => setNewPayment({ ...newPayment, currency: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentType" className="text-right">
                      Payment Type
                    </Label>
                    <Select onValueChange={(value) => setNewPayment({ ...newPayment, paymentType: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full Payment">Full Payment</SelectItem>
                        <SelectItem value="Installments">Installments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddPayment} className="bg-[#00B14F] text-white">
                    Add Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
              <TableHead className="text-white">Invoice Number</TableHead>
              <TableHead className="text-white">Company</TableHead>
              <TableHead className="text-white">Total Amount</TableHead>
              <TableHead className="text-white">Paid Amount</TableHead>
              <TableHead className="text-white">Remaining</TableHead>
              <TableHead className="text-white">Due Date</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Payment Type</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{payment.invoiceNumber}</TableCell>
                <TableCell className="text-white">{payment.company}</TableCell>
                <TableCell className="text-white">
                  {payment.currency} {payment.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-white">
                  {payment.currency} {payment.paidAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-white">
                  {payment.currency} {payment.remainingAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-white">{payment.dueDate}</TableCell>
                <TableCell className="text-white">{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-white">{payment.paymentType}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onSelect={() => {
                        //   setSelectedPayment(payment)
                          setIsPaymentModalOpen(true)
                        }}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                        //   setSelectedPayment(payment)
                          setIsReminderModalOpen(true)
                        }}
                      >
                        Send payment reminder
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleDownloadInvoice(payment)}>
                        Download invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Mark as void</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>View and manage the details of the selected payment.</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Payment Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Invoice Number</Label>
                    <div>{selectedPayment.invoiceNumber}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Company</Label>
                    <div>{selectedPayment.company}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Total Amount</Label>
                    <div>
                      {selectedPayment.currency} {selectedPayment.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Paid Amount</Label>
                    <div>
                      {selectedPayment.currency} {selectedPayment.paidAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Remaining Amount</Label>
                    <div>
                      {selectedPayment.currency} {selectedPayment.remainingAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Date</Label>
                    <div>{selectedPayment.date}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Due Date</Label>
                    <div>{selectedPayment.dueDate}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Payment Method</Label>
                    <div>{selectedPayment.paymentMethod}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Payment Type</Label>
                    <div>{selectedPayment.paymentType}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Payment Timeline</h3>
                  {selectedPayment.paymentType === "Installments" ? (
                    <div className="space-y-4">
                      {selectedPayment.installments.map((installment, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-24 text-right mr-4 text-sm text-gray-500">{installment.dueDate}</div>
                          <div
                            className={`w-4 h-4 rounded-full ${installment.status === "Pending" ? "bg-yellow-500" : "bg-green-500"}`}
                          ></div>
                          <div className="ml-2">
                            {selectedPayment.currency} {installment.amount.toLocaleString()}
                          </div>
                          <div className="ml-4">{installment.status || "Paid"}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-24 text-right mr-4 text-sm text-gray-500">{selectedPayment.date}</div>
                      <div
                        className={`w-4 h-4 rounded-full ${selectedPayment.status === "Paid" ? "bg-green-500" : "bg-yellow-500"}`}
                      ></div>
                      <div className="ml-2">
                        {selectedPayment.currency} {selectedPayment.totalAmount.toLocaleString()}
                      </div>
                      <div className="ml-4">{selectedPayment.status}</div>
                    </div>
                  )}
                  <Progress
                    value={(selectedPayment.paidAmount / selectedPayment.totalAmount) * 100}
                    className="w-full mt-4"
               
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    {selectedPayment.paidAmount.toLocaleString()} / {selectedPayment.totalAmount.toLocaleString()}{" "}
                    {selectedPayment.currency} paid
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPaymentModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderModalOpen} onOpenChange={setIsReminderModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
            <DialogDescription>Send a reminder for the payment to the company.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderMessage" className="text-right">
                Reminder Message
              </Label>
              <Textarea
                id="reminderMessage"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="col-span-3 bg-[#1E1E1E]"
                placeholder="Enter your reminder message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendReminder} className="bg-[#00B14F] text-white">
              <Send className="mr-2 h-4 w-4" /> Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


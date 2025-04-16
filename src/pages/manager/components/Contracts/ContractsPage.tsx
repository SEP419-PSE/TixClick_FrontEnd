import clsx from "clsx"
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Info,
  MoreHorizontal,
  Search,
  Upload,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import type { ContractDocumentDTO, ContractDTO, VietQR } from "../../../../interface/manager/Contracts"
import { formatMoney } from "../../../../lib/utils"
import managerApi from "../../../../services/manager/ManagerApi"
import { banks } from "../../../company/CreateCompany"
import { ManagerHeader } from "../ManagerHeader"
import { UploadDocumentDialog } from "./UploadDocument"

// Define the ContractDetail interface
interface ContractDetail {
  contractDetailId: number
  contractDetailName: string
  contractDetailCode: string
  description: string
  contractAmount: number
  contractPayDate: string
  status: string
  contractId: number
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [contractDocument, setContractDocument] = useState<ContractDocumentDTO[]>([])

  const [selectedContract, setSelectedContract] = useState<ContractDTO>()
  const [selectedContractDocument, setSelectedContractDocument] = useState<ContractDocumentDTO>()
  console.log(selectedContractDocument, setSelectedContractDocument)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)

  const [selectedDocument, setSelectedDocument] = useState("")
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [documentDetails, setDocumentDetails] = useState({
    name: "",
    type: "",
    size: "",
    uploadedBy: "",
    uploadedDate: "",
    lastModified: "",
    version: "",
    description: "",
  })

  const [paymentCode, setPaymentCode] = useState("")
  const [vietQRParams, setVietQRParams] = useState<VietQR>({
    bankID: "",
    accountID: "",
    amount: 0,
    description: "",
  })

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedContractForUpload, setSelectedContractForUpload] = useState<number | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [paymentInfor, setPaymentInfor] = useState<VietQR>()

  // Add a new state for contract details
  const [contractDetails, setContractDetails] = useState<ContractDetail[]>([])

  // Add states for contract detail modal
  const [selectedContractDetail, setSelectedContractDetail] = useState<ContractDetail | null>(null)
  const [isContractDetailModalOpen, setIsContractDetailModalOpen] = useState(false)

  // Function to open contract detail modal
  const openContractDetailModal = (contractDetail: ContractDetail) => {
    setSelectedContractDetail(contractDetail)
    setIsContractDetailModalOpen(true)
  }

  // Add a function to fetch contract details
  const fetchContractDetails = async (contractId: number) => {
    try {
      const response = await managerApi.getContractDetails(contractId)
      console.log("Contract Details:", response.data.result)
      if (response.data.result) {
        setContractDetails(response.data.result)
      }
    } catch (error) {
      console.error("Error fetching contract details:", error)
      toast.error("Failed to fetch contract details")
    }
  }

  const fetchQr = async () => {
    try {
      const contractResponse = await managerApi.getQrByContractId(selectedContract?.contractId)
      console.log("QR", contractResponse)
      if (contractResponse.data.result) {
        setPaymentInfor(contractResponse.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchQr()
  }, [selectedContract])

  const generateVietQRUrl = () => {
    const xBankId = banks.find((x) => x.bankName == paymentInfor?.bankID)?.id
    console.log(xBankId)

    if (!paymentInfor?.bankID || !paymentInfor?.accountID) {
      return null
    }

    const encodedDescription = encodeURIComponent(paymentInfor.description || "")
    const amount = paymentInfor.amount ? paymentInfor.amount : paymentInfor?.amount

    return `https://img.vietqr.io/image/${xBankId}-${paymentInfor.accountID}-compact.png?amount=${amount}&addInfo=${encodedDescription}&accountName=Contract%20Payment`
  }

  const handlePaymentConfirmation = () => {
    if (paymentCode.trim() === "") {
      toast.error("Please enter a payment confirmation code")
      return
    }

    toast.success("Payment confirmed", {
      description: `Payment for contract ${selectedContract?.accountId} has been confirmed.`,
    })
    setPaymentCode("")
  }

  const handleViewDocumentDetails = (doc: string) => {
    setSelectedDocument(doc)

    const fileExtension = doc.split(".").pop() || ""
    const fileType =
      fileExtension === "pdf"
        ? "PDF Document"
        : fileExtension === "docx"
          ? "Word Document"
          : fileExtension === "xlsx"
            ? "Excel Spreadsheet"
            : "Document"

    setDocumentDetails({
      name: doc,
      type: fileType,
      size: `${Math.floor(Math.random() * 10) + 1} MB`,
      uploadedBy: "John Doe",
      uploadedDate: "2023-12-15",
      lastModified: "2024-01-10",
      version: "1.2",
      description: `This is the ${doc} file for contract.`,
    })

    setIsAttachmentModalOpen(true)
  }

  const handleUploadSuccess = async () => {
    await fetchContractList()

    if (selectedContract && selectedContractForUpload === selectedContract.contractId) {
      const contractData = contracts.find((item: any) => item.contractDTO.contractId === selectedContract.contractId)

      if (contractData && contractData.contractDocumentDTOS) {
        setContractDocument(contractData.contractDocumentDTOS)
      }
    }
  }

  const fetchContractList = async () => {
    try {
      const res: any = await managerApi.getAllContract()
      console.log("Contract List:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setContracts(res.data.result)

        if (selectedContract) {
          const contractData = res.data.result.find(
            (item: any) => item.contractDTO.contractId === selectedContract.contractId,
          )
          if (contractData && contractData.contractDocumentDTOS) {
            setContractDocument(contractData.contractDocumentDTOS)
            setSelectedContractDocument(contractData.contractDocumentDTOS[0])
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contract:", error)
      toast.error("Failed to fetch contract")
    }
  }

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchContractList()
    }
    initUseEffect()
  }, [])

  // Modify the openContractModal function to also fetch contract details
  const openContractModal = async (contract: ContractDTO) => {
    setSelectedContract(contract)
    // Find the contract documents for this contract
    const contractData = contracts.find((item: any) => item.contractDTO.contractId === contract.contractId)

    if (contractData && contractData.contractDocumentDTOS) {
      setContractDocument(contractData.contractDocumentDTOS)
      if (contractData.contractDocumentDTOS.length > 0) {
        setSelectedContractDocument(contractData.contractDocumentDTOS[0])
      }
    } else {
      setContractDocument([])
      setSelectedContractDocument(undefined)
    }

    // Fetch contract details
    if (contract.contractId) {
      await fetchContractDetails(contract.contractId)
    }

    setIsContractModalOpen(true)
  }

  useEffect(() => {
    if (selectedContract && selectedContract.contractId) {
      setVietQRParams({
        bankID: "BIDV",
        accountID: "31410001689304",
        amount: selectedContract.totalAmount,
        description: `Payment for contract #${selectedContract.contractId}`,
      })
    }
  }, [selectedContract])

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">Approved</span>
      case "PENDING":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">Pending</span>
      case "Expired":
        return <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">Expired</span>
      default:
        return <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-500">{status}</span>
    }
  }

  // Add a function to get status badge for contract details
  const getContractDetailStatusBadge = (status: string) => {
    let style = ""
    let label = status

    switch (status) {
      case "PAID":
        style = "bg-green-900 text-green-300 border border-green-800 rounded px-2 py-0.5 text-sm"
        label = "Paid"
        break
      case "PENDING":
        style = "bg-yellow-900 text-yellow-300 border border-yellow-800 rounded px-2 py-0.5 text-sm"
        label = "Pending"
        break
      case "OVERDUE":
        style = "bg-red-900 text-red-300 border border-red-800 rounded px-2 py-0.5 text-sm"
        label = "Overdue"
        break
      default:
        style = "bg-gray-500/20 text-gray-500 rounded px-2 py-0.5 text-sm"
        label = status
        break
    }

    return <span className={style}>{label}</span>
  }

  const getDocumentIcon = (doc: string) => {
    const fileExtension = doc.split(".").pop()?.toLowerCase() || ""

    switch (fileExtension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-400" />
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-400" />
      case "xlsx":
      case "xls":
        return <FileText className="h-5 w-5 text-green-400" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const paginate = (items: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = Math.ceil(contracts.length / itemsPerPage)
  const paginatedContracts = paginate(contracts, currentPage, itemsPerPage)

  return (
    <>
      <ManagerHeader heading="Contracts" text="Manage and track all contracts" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input className="w-[300px] bg-[#2A2A2A] text-white" placeholder="Search contracts..." />
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service Agreement</SelectItem>
                <SelectItem value="licensing">Licensing Agreement</SelectItem>
                <SelectItem value="partnership">Partnership Agreement</SelectItem>
                <SelectItem value="maintenance">Maintenance Agreement</SelectItem>
                <SelectItem value="consulting">Consulting Agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableHead className="text-white">Contract Name</TableHead>
                <TableHead className="text-white">Company</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Start Date</TableHead>
                <TableHead className="text-white">End Date</TableHead>
                <TableHead className="text-white">Value</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContracts.map((contractItem) => {
                const contract = contractItem.contractDTO
                return (
                  <TableRow key={contract.contractId} className="border-[#333333] hover:bg-[#2A2A2A]">
                    <TableCell className="font-medium text-white">{contract.contractName}</TableCell>
                    <TableCell className="text-white">Company {contract.companyId}</TableCell>
                    <TableCell className="text-white">{contract.contractType}</TableCell>
                    <TableCell className="text-white">{contract.startDate || "N/A"}</TableCell>
                    <TableCell className="text-white">{contract.endDate || "N/A"}</TableCell>
                    <TableCell className="text-white">${contract.totalAmount?.toLocaleString() || "0"}</TableCell>
                    <TableCell>{getStatusBadge(contract.status || "N/A")}</TableCell>
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
                          <DropdownMenuItem onClick={() => openContractModal(contract)}>View details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-yellow-500">
                            <Bell className="mr-2 h-4 w-4" />
                            Set reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Terminate contract</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="mt-6 border-t border-[#333333] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {Math.min((currentPage - 1) * itemsPerPage + 1, contracts.length)}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-white">
                    {Math.min(currentPage * itemsPerPage, contracts.length)}
                  </span>{" "}
                  of <span className="font-medium text-white">{contracts.length}</span> contracts
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[110px] h-9 bg-[#2A2A2A] text-white border-[#333333]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="15">15 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>

                <nav className="flex items-center space-x-1" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">First page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-left"
                    >
                      <path d="m11 17-5-5 5-5" />
                      <path d="m18 17-5-5 5-5" />
                    </svg>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {totalPages <= 5 ? (
                    // If 5 or fewer pages, show all page numbers
                    Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === i + 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        <span>{i + 1}</span>
                      </Button>
                    ))
                  ) : (
                    // If more than 5 pages, show a smart subset
                    <>
                      {/* Always show first page */}
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === 1
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(1)}
                      >
                        <span>1</span>
                      </Button>

                      {/* Show ellipsis if current page is > 3 */}
                      {currentPage > 3 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      {currentPage > 2 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <span>{currentPage - 1}</span>
                        </Button>
                      )}

                      {currentPage !== 1 && currentPage !== totalPages && (
                        <Button
                          variant="default"
                          size="icon"
                          className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 rounded-md"
                        >
                          <span>{currentPage}</span>
                        </Button>
                      )}

                      {currentPage < totalPages - 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <span>{currentPage + 1}</span>
                        </Button>
                      )}

                      {/* Show ellipsis if current page is < totalPages - 2 */}
                      {currentPage < totalPages - 2 && (
                        <span className="mx-1 text-gray-400 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-more-horizontal"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </span>
                      )}

                      {/* Always show last page */}
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="icon"
                        className={`h-9 w-9 ${
                          currentPage === totalPages
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333]"
                        } rounded-md`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        <span>{totalPages}</span>
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-[#2A2A2A] text-white border-[#333333] hover:bg-[#333333] rounded-md"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Last page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevrons-right"
                    >
                      <path d="m6 17 5-5-5-5" />
                      <path d="m13 17 5-5-5-5" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View and manage the details of the selected contract.</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                {/* <TabsTrigger value="details">Details</TabsTrigger> */}
                <TabsTrigger value="contractDetails">Payment Schedule</TabsTrigger>
                {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                {/* <TabsTrigger value="payment">Payment</TabsTrigger> */}
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Contract Name</Label>
                    <div>{selectedContract.contractName}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Company</Label>
                    <div>Company {selectedContract.companyId}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <div>{selectedContract.contractType}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Start Date</Label>
                    <div>{selectedContract.startDate || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">End Date</Label>
                    <div>{selectedContract.endDate || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Value</Label>
                    <div>${selectedContract.totalAmount?.toLocaleString() || "0"}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>{getStatusBadge(selectedContract.status || "Unknown")}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Commission</Label>
                    <div>{selectedContract.commission || "Not specified"}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="contractDetails">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Payment Schedule</h3>

                  {contractDetails && contractDetails.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                            <TableHead className="text-white">Payment Name</TableHead>
                            <TableHead className="text-white">Code</TableHead>
                            <TableHead className="text-white">Amount</TableHead>
                            <TableHead className="text-white">Due Date</TableHead>
                            <TableHead className="text-white">Description</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Payment</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contractDetails.map((detail) => (
                            <TableRow key={detail.contractDetailId} className="border-[#333333] hover:bg-[#2A2A2A]">
                              <TableCell className="font-medium text-white">{detail.contractDetailName}</TableCell>
                              <TableCell className="text-white">{detail.contractDetailCode}</TableCell>
                              <TableCell className="text-white">
                                ${detail.contractAmount?.toLocaleString() || "0"}
                              </TableCell>
                              <TableCell className="text-white">{detail.contractPayDate || "N/A"}</TableCell>
                              <TableCell className="text-white">{detail.description || "N/A"}</TableCell>
                              <TableCell>{getContractDetailStatusBadge(detail.status)}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                      <DollarSign className="h-4 w-4" />
                                      <span className="sr-only">Show VietQR</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-[#2A2A2A] text-white max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Payment QR Code</DialogTitle>
                                      <DialogDescription>
                                        Scan this QR code to pay for {detail.contractDetailName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center justify-center p-4">
                                      <div className="bg-white p-4 rounded-lg mb-4">
                                        <img
                                          src={`https://img.vietqr.io/image/${paymentInfor?.bankID ? banks.find((x) => x.bankName == paymentInfor?.bankID)?.id : "BIDV"}-${paymentInfor?.accountID || "31410001689304"}-compact.png?amount=${detail.contractAmount || 0}&addInfo=Payment for ${detail.contractDetailName}&accountName=Contract%20Payment`}
                                          alt="VietQR Payment Code"
                                          width={200}
                                          height={200}
                                          className="w-48 h-48"
                                        />
                                      </div>
                                      <div className="text-center space-y-2">
                                        <p className="text-sm">
                                          <span className="text-gray-400">Amount:</span> $
                                          {detail.contractAmount?.toLocaleString() || "0"}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-gray-400">Due Date:</span>{" "}
                                          {detail.contractPayDate || "N/A"}
                                        </p>
                                        <p className="text-sm">
                                          <span className="text-gray-400">Reference:</span> {detail.contractDetailCode}
                                        </p>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={() => toast.success("QR code copied to clipboard")}>
                                        Copy Payment Link
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <p className="mb-4 text-gray-400">No payment schedule available for this contract.</p>
                    </div>
                  )}

                  {/* Summary section */}
                  {contractDetails && contractDetails.length > 0 && (
                    <div className="mt-6 p-4 bg-[#1E1E1E] rounded-lg">
                      <h4 className="text-md font-medium mb-3">Payment Summary</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Total Contract Value:</p>
                          <p className="text-lg font-semibold">
                            ${selectedContract?.totalAmount?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Payments:</p>
                          <p className="text-lg font-semibold">
                            $
                            {contractDetails
                              .reduce((sum, detail) => sum + (detail.contractAmount || 0), 0)
                              .toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Paid Amount:</p>
                          <p className="text-lg font-semibold text-green-500">
                            $
                            {contractDetails
                              .filter((detail) => detail.status === "PAID")
                              .reduce((sum, detail) => sum + (detail.contractAmount || 0), 0)
                              .toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Pending Amount:</p>
                          <p className="text-lg font-semibold text-yellow-500">
                            $
                            {contractDetails
                              .filter((detail) => detail.status === "PENDING")
                              .reduce((sum, detail) => sum + (detail.contractAmount || 0), 0)
                              .toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Contract Documents</h3>

                  {contractDocument && contractDocument.length > 0 ? (
                    <div>
                      <Tabs defaultValue="all" className="w-full mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="all">All Documents</TabsTrigger>
                          <TabsTrigger value="contracts">Contracts</TabsTrigger>
                          <TabsTrigger value="attachments">Attachments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                          <ul className="space-y-2 mt-4">
                            {contractDocument.map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between p-2 rounded hover:bg-[#333333]"
                              >
                                <div className="flex items-center">
                                  {getDocumentIcon(doc.fileName)}
                                  <span className="ml-2">{doc.fileName}</span>
                                </div>
                                <div className="flex gap-2 text-black">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDocumentDetails(doc.fileName)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>

                        <TabsContent value="contracts">
                          <div className="bg-[#1E1E1E] p-4 rounded-lg mt-4">
                            <h4 className="text-md font-medium mb-3">Main Contract Documents</h4>
                            {contractDocument.filter(
                              (doc) => doc.fileName.includes("Contract") || doc.fileName.includes("Agreement"),
                            ).length > 0 ? (
                              <ul className="space-y-2">
                                {contractDocument
                                  .filter(
                                    (doc) => doc.fileName.includes("Contract") || doc.fileName.includes("Agreement"),
                                  )
                                  .map((doc, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center justify-between p-2 rounded hover:bg-[#333333]"
                                    >
                                      <div className="flex items-center">
                                        {getDocumentIcon(doc.fileName)}
                                        <span className="ml-2">{doc.fileName}</span>
                                      </div>
                                      <div className="flex gap-2 text-black">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleViewDocumentDetails(doc.fileName)}
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </Button>
                                        <Button variant="outline" size="sm">
                                          <Download className="mr-2 h-4 w-4" />
                                          Download
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400">No contract documents available</p>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="attachments">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-[#1E1E1E] p-4 rounded-lg">
                              <h4 className="text-md font-medium mb-3">Legal Attachments</h4>
                              {contractDocument.filter(
                                (doc) => doc.fileName.includes("Legal") || doc.fileName.includes("Terms"),
                              ).length > 0 ? (
                                <ul className="space-y-2">
                                  {contractDocument
                                    .filter((doc) => doc.fileName.includes("Legal") || doc.fileName.includes("Terms"))
                                    .map((doc, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded hover:bg-[#333333]"
                                      >
                                        <div className="flex items-center">
                                          {getDocumentIcon(doc.fileName)}
                                          <span className="ml-2">{doc.fileName}</span>
                                        </div>
                                        <div className="flex gap-2 text-black">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDocumentDetails(doc.fileName)}
                                          >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Button>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400">No legal attachments</p>
                              )}
                            </div>

                            <div className="bg-[#1E1E1E] p-4 rounded-lg">
                              <h4 className="text-md font-medium mb-3">Financial Attachments</h4>
                              {contractDocument.filter(
                                (doc) =>
                                  doc.fileName.includes("Invoice") ||
                                  doc.fileName.includes("Payment") ||
                                  doc.fileName.includes("Financial"),
                              ).length > 0 ? (
                                <ul className="space-y-2">
                                  {contractDocument
                                    .filter(
                                      (doc) =>
                                        doc.fileName.includes("Invoice") ||
                                        doc.fileName.includes("Payment") ||
                                        doc.fileName.includes("Financial"),
                                    )
                                    .map((doc, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded hover:bg-[#333333]"
                                      >
                                        <div className="flex items-center">
                                          {getDocumentIcon(doc.fileName)}
                                          <span className="ml-2">{doc.fileName}</span>
                                        </div>
                                        <div className="flex gap-2 text-black">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDocumentDetails(doc.fileName)}
                                          >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Button>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400">No financial attachments</p>
                              )}
                            </div>

                            <div className="bg-[#1E1E1E] p-4 rounded-lg">
                              <h4 className="text-md font-medium mb-3">Technical Attachments</h4>
                              {contractDocument.filter(
                                (doc) =>
                                  doc.fileName.includes("Technical") ||
                                  doc.fileName.includes("Specification") ||
                                  doc.fileName.includes("Requirements"),
                              ).length > 0 ? (
                                <ul className="space-y-2">
                                  {contractDocument
                                    .filter(
                                      (doc) =>
                                        doc.fileName.includes("Technical") ||
                                        doc.fileName.includes("Specification") ||
                                        doc.fileName.includes("Requirements"),
                                    )
                                    .map((doc, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center justify-between p-2 rounded hover:bg-[#333333]"
                                      >
                                        <div className="flex items-center">
                                          {getDocumentIcon(doc.fileName)}
                                          <span className="ml-2">{doc.fileName}</span>
                                        </div>
                                        <div className="flex gap-2 text-black">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDocumentDetails(doc.fileName)}
                                          >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                          </Button>
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400">No technical attachments</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            setSelectedContractForUpload(selectedContract?.contractId || null)
                            setIsUploadDialogOpen(true)
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <p className="mb-4 text-gray-400">No documents uploaded yet.</p>
                      <Button
                        onClick={() => {
                          setSelectedContractForUpload(selectedContract?.contractId || null)
                          setIsUploadDialogOpen(true)
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Contract Timeline</h3>
                  <div className="relative pl-6 border-l-2 border-gray-600 space-y-6 ml-4">
                    {/* Contract Start */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-green-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">Contract Start</div>
                      <div className="text-sm text-gray-400">{selectedContract?.startDate || "Not specified"}</div>
                    </div>

                    {/* Document Uploads */}
                    {contractDocument && contractDocument.length > 0 ? (
                      contractDocument.map((doc, index) => (
                        <div className="relative" key={index}>
                          <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[18px]"></div>
                          <div className="mb-1 text-sm font-medium">Document Uploaded: {doc.fileName}</div>
                          <div className="text-sm text-gray-400">
                            {doc.uploadDate || new Date().toISOString().split("T")[0]}
                          </div>
                          <div className="text-sm text-gray-400">Uploaded by: {doc.uploadedBy || "System User"}</div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-gray-500 -left-[18px]"></div>
                        <div className="mb-1 text-sm font-medium">No documents uploaded yet</div>
                        <div className="text-sm text-gray-400">Upload documents to track contract progress</div>
                      </div>
                    )}

                    {/* Current Date */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">Current Date</div>
                      <div className="text-sm text-gray-400">{new Date().toISOString().split("T")[0]}</div>
                    </div>

                    {/* Contract End */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-red-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">Contract End</div>
                      <div className="text-sm text-gray-400">{selectedContract?.endDate || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Contract Payment</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                        <h4 className="flex text-md font-medium mb-2">
                          Payment Details{" "}
                          <span className="ml-2 flex items-center gap-1">
                            <div
                              className={`h-3 w-3 rounded-full ${clsx({
                                "bg-pse-green": paymentInfor?.status === "PENDING",
                                "bg-green-600": paymentInfor?.status === "PAID",
                                "bg-red-600": paymentInfor?.status === "OVERDUE",
                              })}`}
                            ></div>
                            {paymentInfor?.status}
                          </span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-400">Contract Value:</div>
                          <div>{formatMoney(paymentInfor?.amount)}</div>
                          <div className="text-gray-400">Payment Status:</div>
                          <div>Pending</div>
                          <div className="text-gray-400">Due Date:</div>
                          <div>{paymentInfor?.dueDate}</div>
                          <div className="text-gray-400">Bank:</div>
                          <div>{paymentInfor?.bankID}</div>
                          <div className="text-gray-400">Account Number:</div>
                          <div>{paymentInfor?.accountID}</div>
                          <div className="text-gray-400">Description:</div>
                          <div className="truncate">{paymentInfor?.description}</div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                        <h4 className="text-md font-medium mb-2">Confirm Payment</h4>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-400">
                            After completing payment, enter the confirmation code below:
                          </p>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter payment code"
                              value={paymentCode}
                              onChange={(e) => setPaymentCode(e.target.value)}
                              className="bg-[#2A2A2A]"
                            />
                            <Button onClick={handlePaymentConfirmation}>Confirm</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <div className="mb-4 text-center">
                        <h4 className="text-md font-medium mb-1">Scan to Pay</h4>
                        <p className="text-sm text-gray-400">Scan this VietQR code to make payment for this contract</p>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:scale-105 transition">
                            {generateVietQRUrl() ? (
                              <img
                                src={generateVietQRUrl() || ""}
                                alt="VietQR Payment Code"
                                width={200}
                                height={200}
                                className="w-48 h-48"
                              />
                            ) : (
                              <div className="w-48 h-48 flex flex-col items-center justify-center text-black">
                                <p className="text-center text-sm">Loading payment QR code...</p>
                              </div>
                            )}
                          </div>
                        </DialogTrigger>

                        <DialogContent className="flex flex-col items-center p-6">
                          {generateVietQRUrl() && (
                            <img src={generateVietQRUrl() || ""} alt="VietQR Payment Code" className="w-80 h-80" />
                          )}
                        </DialogContent>
                      </Dialog>

                      <p className="text-xs text-gray-400 text-center">
                        Payment reference: {selectedContract.contractId}-
                        {
                          selectedContract.companyId
                          // .replace(/\s+/g, "")
                          // .toLowerCase()
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Contract Detail Modal */}
      <Dialog open={isContractDetailModalOpen} onOpenChange={setIsContractDetailModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Detail</DialogTitle>
            <DialogDescription>
              View detailed information for payment {selectedContractDetail?.contractDetailName}
            </DialogDescription>
          </DialogHeader>

          {selectedContractDetail && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedContractDetail.contractDetailName}</h2>
                  <p className="text-gray-400">Code: {selectedContractDetail.contractDetailCode}</p>
                </div>
                <div>{getContractDetailStatusBadge(selectedContractDetail.status)}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#1E1E1E] border-[#333333]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-semibold">
                          ${selectedContractDetail.contractAmount?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Status:</span>
                        <span>{selectedContractDetail.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contract ID:</span>
                        <span>{selectedContractDetail.contractId}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1E1E1E] border-[#333333]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      Schedule Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="font-semibold">{selectedContractDetail.contractPayDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Days Remaining:</span>
                        <span>
                          {(() => {
                            const dueDate = new Date(selectedContractDetail.contractPayDate)
                            const today = new Date()
                            const diffTime = dueDate.getTime() - today.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                            if (diffDays < 0) {
                              return <span className="text-red-500">Overdue by {Math.abs(diffDays)} days</span>
                            } else if (diffDays === 0) {
                              return <span className="text-yellow-500">Due today</span>
                            } else {
                              return <span className={diffDays <= 7 ? "text-yellow-500" : ""}>{diffDays} days</span>
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-500" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{selectedContractDetail.description || "No description provided."}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] border-[#333333]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-orange-500" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContractDetail.status === "PAID" ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span>Payment received</span>
                            <span className="text-gray-400">2024-03-15</span>
                          </div>
                          <p className="text-sm text-gray-400">Payment confirmed via bank transfer</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span>Invoice sent</span>
                            <span className="text-gray-400">2024-03-10</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Invoice #INV-{selectedContractDetail.contractDetailId}-{selectedContractDetail.contractId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span>Invoice sent</span>
                            <span className="text-gray-400">2024-03-10</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Invoice #INV-{selectedContractDetail.contractDetailId}-{selectedContractDetail.contractId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span>Payment pending</span>
                            <span className="text-gray-400">Awaiting payment</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            Payment due by {selectedContractDetail.contractPayDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  {selectedContractDetail.status === "PENDING" && (
                    <Button className="bg-green-600 hover:bg-green-700">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  )}
                  <Button variant="outline" className="bg-[#1E1E1E] hover:bg-[#333333] text-white">
                    <Bell className="mr-2 h-4 w-4" />
                    Set Reminder
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsContractDetailModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAttachmentModalOpen} onOpenChange={setIsAttachmentModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>View details for {selectedDocument}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
              {getDocumentIcon(selectedDocument)}
              <span className="ml-2 text-xl font-medium">{selectedDocument}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">File Type</h4>
                <p>{documentDetails.type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">File Size</h4>
                <p>{documentDetails.size}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Uploaded By</h4>
                <p>{documentDetails.uploadedBy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Upload Date</h4>
                <p>{documentDetails.uploadedDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Last Modified</h4>
                <p>{documentDetails.lastModified}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">Version</h4>
                <p>{documentDetails.version}</p>
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-400">Description</h4>
              <p className="mt-1">{documentDetails.description}</p>
            </div>

            <div className="mt-4 p-3 bg-[#1E1E1E] rounded-lg">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Document History</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Created document</span>
                  <span className="text-gray-400">2023-12-10</span>
                </li>
                <li className="flex justify-between">
                  <span>Updated content</span>
                  <span className="text-gray-400">2023-12-15</span>
                </li>
                <li className="flex justify-between">
                  <span>Reviewed by legal</span>
                  <span className="text-gray-400">2024-01-05</span>
                </li>
                <li className="flex justify-between">
                  <span>Final version approved</span>
                  <span className="text-gray-400">2024-01-10</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2 text-black">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </div>
            <Button className="text-black" onClick={() => setIsAttachmentModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UploadDocumentDialog
        contractId={selectedContractForUpload || 0}
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  )
}

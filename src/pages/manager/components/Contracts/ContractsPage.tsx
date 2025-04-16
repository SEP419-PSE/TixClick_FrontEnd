import clsx from "clsx";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Upload
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import type {
  Contract,
  ContractDocumentDTO,
  ContractDTO,
  VietQR,
} from "../../../../interface/manager/Contracts";
import { formatMoney } from "../../../../lib/utils";
import managerApi from "../../../../services/manager/ManagerApi";
import { banks } from "../../../company/CreateCompany";
import { ManagerHeader } from "../ManagerHeader";
import { UploadDocumentDialog } from "./UploadDocument";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [contractDocument, setContractDocument] = useState<
    ContractDocumentDTO[]
  >([]);


  const [selectedContract, setSelectedContract] = useState<ContractDTO>();
  const [selectedContractDocument, setSelectedContractDocument] =
    useState<ContractDocumentDTO>();
  console.log(selectedContractDocument, setSelectedContractDocument);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState("");
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [documentDetails, setDocumentDetails] = useState({
    name: "",
    type: "",
    size: "",
    uploadedBy: "",
    uploadedDate: "",
    lastModified: "",
    version: "",
    description: "",
  });

  const [paymentCode, setPaymentCode] = useState("");
  const [vietQRParams, setVietQRParams] = useState<VietQR>({
    bankID: "",
    accountID: "",
    amount: 0,
    description: "",
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedContractForUpload, setSelectedContractForUpload] = useState<
    number | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paymentInfor, setPaymentInfor] = useState<VietQR>();

  const fetchQr = async () => {
    try {
      const contractResponse = await managerApi.getQrByContractId(
        selectedContract?.contractId
      );
      console.log("QR", contractResponse);
      if (contractResponse.data.result) {
        setPaymentInfor(contractResponse.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQr();
  }, [selectedContract]);

  const generateVietQRUrl = () => {
    const xBankId = banks.find((x) => x.bankName == paymentInfor?.bankID)?.id;
    console.log(xBankId);

    if (!paymentInfor?.bankID || !paymentInfor?.accountID) {
      return null;
    }

    const encodedDescription = encodeURIComponent(
      paymentInfor.description || ""
    );
    const amount = paymentInfor.amount
      ? paymentInfor.amount
      : paymentInfor?.amount;

    return `https://img.vietqr.io/image/${xBankId}-${paymentInfor.accountID}-compact.png?amount=${amount}&addInfo=${encodedDescription}&accountName=Contract%20Payment`;
  };

  const handlePaymentConfirmation = () => {
    if (paymentCode.trim() === "") {
      toast.error("Please enter a payment confirmation code");
      return;
    }

    toast.success("Payment confirmed", {
      description: `Payment for contract ${selectedContract?.accountId} has been confirmed.`,
    });
    setPaymentCode("");
  };

  const handleViewDocumentDetails = (doc: string) => {
    setSelectedDocument(doc);

    const fileExtension = doc.split(".").pop() || "";
    const fileType =
      fileExtension === "pdf"
        ? "PDF Document"
        : fileExtension === "docx"
        ? "Word Document"
        : fileExtension === "xlsx"
        ? "Excel Spreadsheet"
        : "Document";

    setDocumentDetails({
      name: doc,
      type: fileType,
      size: `${Math.floor(Math.random() * 10) + 1} MB`,
      uploadedBy: "John Doe",
      uploadedDate: "2023-12-15",
      lastModified: "2024-01-10",
      version: "1.2",
      description: `This is the ${doc} file for contract.`,
    });

    setIsAttachmentModalOpen(true);
  };

 

  const handleUploadSuccess = async () => {
    await fetchContractList();

    if (
      selectedContract &&
      selectedContractForUpload === selectedContract.contractId
    ) {
      const contractData = contracts.find(
        (item: any) =>
          item.contractDTO.contractId === selectedContract.contractId
      );

      if (contractData && contractData.contractDocumentDTOS) {
        setContractDocument(contractData.contractDocumentDTOS);
      }
    }
  };

  const fetchContractList = async () => {
    try {
      const res: any = await managerApi.getAllContract();
      console.log("Contract List:", res.data.result);
      if (res.data.result && res.data.result.length > 0) {
        setContracts(res.data.result);

        if (selectedContract) {
          const contractData = res.data.result.find(
            (item: any) =>
              item.contractDTO.contractId === selectedContract.contractId
          );
          if (contractData && contractData.contractDocumentDTOS) {
            setContractDocument(contractData.contractDocumentDTOS);
            setSelectedContractDocument(contractData.contractDocumentDTOS[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error("Failed to fetch contract");
    }
  };

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchContractList();
    };
    initUseEffect();
  }, []);

  const openContractModal = async (contract: ContractDTO) => {
    setSelectedContract(contract);
    // Find the contract documents for this contract
    const contractData = contracts.find(
      (item: any) => item.contractDTO.contractId === contract.contractId
    );

    if (contractData && contractData.contractDocumentDTOS) {
      setContractDocument(contractData.contractDocumentDTOS);
      if (contractData.contractDocumentDTOS.length > 0) {
        setSelectedContractDocument(contractData.contractDocumentDTOS[0]);
      }
    } else {
      setContractDocument([]);
      setSelectedContractDocument(undefined);
    }

    setIsContractModalOpen(true);
  };

  useEffect(() => {
    if (selectedContract && selectedContract.contractId) {
      setVietQRParams({
        bankID: "BIDV",
        accountID: "31410001689304",
        amount: selectedContract.totalAmount,
        description: `Payment for contract #${selectedContract.contractId}`,
      });
    }
  }, [selectedContract]);

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
            Pending
          </span>
        );
      case "Expired":
        return (
          <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">
            Expired
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-lg bg-gray-500/20 text-gray-500">
            {status}
          </span>
        );
    }
  };

  const getDocumentIcon = (doc: string) => {
    const fileExtension = doc.split(".").pop()?.toLowerCase() || "";

    switch (fileExtension) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-400" />;
      case "docx":
      case "doc":
        return <FileText className="h-5 w-5 text-blue-400" />;
      case "xlsx":
      case "xls":
        return <FileText className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const paginate = (items: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const paginatedContracts = paginate(contracts, currentPage, itemsPerPage);

  return (
    <>
      <ManagerHeader
        heading="Contracts"
        text="Manage and track all contracts"
      />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              className="w-[300px] bg-[#2A2A2A] text-white"
              placeholder="Search contracts..."
            />
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
                <SelectItem value="partnership">
                  Partnership Agreement
                </SelectItem>
                <SelectItem value="maintenance">
                  Maintenance Agreement
                </SelectItem>
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
                const contract = contractItem.contractDTO;
                return (
                  <TableRow
                    key={contract.contractId}
                    className="border-[#333333] hover:bg-[#2A2A2A]"
                  >
                    <TableCell className="font-medium text-white">
                      {contract.contractName}
                    </TableCell>
                    <TableCell className="text-white">
                      Company {contract.companyId}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.contractType}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.startDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-white">
                      {contract.endDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-white">
                      ${contract.totalAmount?.toLocaleString() || "0"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(contract.status || "N/A")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#2A2A2A] text-white"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openContractModal(contract)}
                          >
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-yellow-500">
                            <Bell className="mr-2 h-4 w-4" />
                            Set reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            Terminate contract
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-6 border-t border-[#333333] pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-white">
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      contracts.length
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-white">
                    {Math.min(currentPage * itemsPerPage, contracts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-white">
                    {contracts.length}
                  </span>{" "}
                  contracts
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); 
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

                <nav
                  className="flex items-center space-x-1"
                  aria-label="Pagination"
                >
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
            <DialogDescription>
              View and manage the details of the selected contract.
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
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
                    <div>
                      ${selectedContract.totalAmount?.toLocaleString() || "0"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>
                      {getStatusBadge(selectedContract.status || "Unknown")}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Commission</Label>
                    <div>{selectedContract.commission || "Not specified"}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Contract Documents
                  </h3>
                  {contractDocument && contractDocument.length > 0 ? (
                    <div>
                      <ul className="space-y-2">
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
                                onClick={() =>
                                  handleViewDocumentDetails(doc.fileName)
                                }
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
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <p className="mb-4 text-gray-400">
                        No documents uploaded yet.
                      </p>
                      
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Contract Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-gray-600 space-y-6 ml-4">
                    {/* Contract Start */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-green-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Contract Start
                      </div>
                      <div className="text-sm text-gray-400">
                        {selectedContract?.startDate || "Not specified"}
                      </div>
                    </div>

                    {/* Document Uploads */}
                    {contractDocument && contractDocument.length > 0 ? (
                      contractDocument.map((doc, index) => (
                        <div className="relative" key={index}>
                          <div className="absolute w-4 h-4 rounded-full bg-blue-500 -left-[18px]"></div>
                          <div className="mb-1 text-sm font-medium">
                            Document Uploaded: {doc.fileName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {doc.uploadDate ||
                              new Date().toISOString().split("T")[0]}
                          </div>
                          <div className="text-sm text-gray-400">
                            Uploaded by: {doc.uploadedBy || "System User"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-gray-500 -left-[18px]"></div>
                        <div className="mb-1 text-sm font-medium">
                          No documents uploaded yet
                        </div>
                        <div className="text-sm text-gray-400">
                          Upload documents to track contract progress
                        </div>
                      </div>
                    )}

                    {/* Current Date */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-purple-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Current Date
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date().toISOString().split("T")[0]}
                      </div>
                    </div>

                    {/* Contract End */}
                    <div className="relative">
                      <div className="absolute w-4 h-4 rounded-full bg-red-500 -left-[18px]"></div>
                      <div className="mb-1 text-sm font-medium">
                        Contract End
                      </div>
                      <div className="text-sm text-gray-400">
                        {selectedContract?.endDate || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Contract Payment
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                        <h4 className="flex text-md font-medium mb-2">
                          Payment Details{" "}
                          <span className="ml-2 flex items-center gap-1">
                            <div
                              className={`h-3 w-3 rounded-full ${clsx({
                                "bg-pse-green":
                                  paymentInfor?.status === "PENDING",
                                "bg-green-600": paymentInfor?.status === "PAID",
                                "bg-red-600":
                                  paymentInfor?.status === "OVERDUE",
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
                          <div className="truncate">
                            {paymentInfor?.description}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                        <h4 className="text-md font-medium mb-2">
                          Confirm Payment
                        </h4>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-400">
                            After completing payment, enter the confirmation
                            code below:
                          </p>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter payment code"
                              value={paymentCode}
                              onChange={(e) => setPaymentCode(e.target.value)}
                              className="bg-[#2A2A2A]"
                            />
                            <Button onClick={handlePaymentConfirmation}>
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
                      <div className="mb-4 text-center">
                        <h4 className="text-md font-medium mb-1">
                          Scan to Pay
                        </h4>
                        <p className="text-sm text-gray-400">
                          Scan this VietQR code to make payment for this
                          contract
                        </p>
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
                                <p className="text-center text-sm">
                                  Loading payment QR code...
                                </p>
                              </div>
                            )}
                          </div>
                        </DialogTrigger>

                        <DialogContent className="flex flex-col items-center p-6">
                          {generateVietQRUrl() && (
                            <img
                              src={generateVietQRUrl() || ""}
                              alt="VietQR Payment Code"
                              className="w-80 h-80"
                            />
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

      <Dialog
        open={isAttachmentModalOpen}
        onOpenChange={setIsAttachmentModalOpen}
      >
        <DialogContent className="bg-[#2A2A2A] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              View details for {selectedDocument}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center p-6 bg-[#1E1E1E] rounded-lg">
              {getDocumentIcon(selectedDocument)}
              <span className="ml-2 text-xl font-medium">
                {selectedDocument}
              </span>
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
                <h4 className="text-sm font-medium text-gray-400">
                  Uploaded By
                </h4>
                <p>{documentDetails.uploadedBy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">
                  Upload Date
                </h4>
                <p>{documentDetails.uploadedDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400">
                  Last Modified
                </h4>
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
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Document History
              </h4>
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
              <Button
                variant="outline"
          
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </div>
            <Button
              className="text-black"
              onClick={() => setIsAttachmentModalOpen(false)}
            >
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
  );
}

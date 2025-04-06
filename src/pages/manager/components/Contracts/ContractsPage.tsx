import {
  Bell,
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
import { ContractDocumentDTO, ContractDTO, VietQR } from "../../../../interface/manager/Contracts";
import managerApi from "../../../../services/manager/ManagerApi";
import { ManagerHeader } from "../ManagerHeader";
import { UploadDocumentDialog } from "./UploadDocument";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([])
  const [contractDocument, setContractDocument] = useState<ContractDocumentDTO[]>([])

  // const [newContract, setNewContract] = useState({
  //   name: "",
  //   company: "",
  //   type: "",
  //   startDate: "",
  //   endDate: "",
  //   value: "",
  //   status: "Draft",
  // })

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
    amount: "",
    description: "",
  })

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedContractForUpload, setSelectedContractForUpload] = useState<number | null>(null)

  const generateVietQRUrl = () => {
    if (!vietQRParams.bankID || !vietQRParams.accountID) {
      return null
    }

    const encodedDescription = encodeURIComponent(vietQRParams.description || "")
    const amount = vietQRParams.amount ? Number.parseInt(vietQRParams.amount) : selectedContract?.totalAmount

    return `https://img.vietqr.io/image/${vietQRParams.bankID}-${vietQRParams.accountID}-compact.png?amount=${amount}&addInfo=${encodedDescription}&accountName=Contract%20Payment`
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
      // description: `This is the ${doc} file for contract ${selectedContract.name}.`,
    })

    setIsAttachmentModalOpen(true)
  }

  const handleUploadDocument = (id: number) => {
    setSelectedContractForUpload(id)
    setIsUploadDialogOpen(true)
  }

  const handleUploadSuccess = async () => {
    // Refresh the contract list to show the new document
    await fetchContractList()

    // If we have a selected contract, update its documents
    if (selectedContract && selectedContractForUpload === selectedContract.contractId) {
      const contractData = contracts.find((item: any) => item.contractDTO.contractId === selectedContract.contractId)

      if (contractData && contractData.contractDocumentDTOS) {
        setContractDocument(contractData.contractDocumentDTOS)
      }
    }
  }

  // const handleUploadDocument = async (id: number) => {
  //   try {
  //     // Create a file input element
  //     const fileInput = document.createElement('input');
  //     fileInput.type = 'file';
  //     fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt';

  //     // Handle file selection
  //     fileInput.onchange = async (e) => {
  //       const files = (e.target as HTMLInputElement).files;
  //       if (!files || files.length === 0) return;

  //       const file = files[0];

  //       try {
  //         // Show loading toast
  //         toast.loading("Uploading document...");

  //         // Call the API to upload the document
  //         const response = await managerApi.uploadContractDocument(id, file);

  //         // Handle successful upload
  //         if (response.data && response.data.code === 0) {
  //           toast.dismiss();
  //           toast.success("Document Uploaded", {
  //             description: "The document has been successfully uploaded."
  //           });

  //           // Refresh the contract list to show the new document
  //           await fetchContractList();

  //           // If we have a selected contract, update its documents
  //           if (selectedContract && selectedContract.contractId === id) {
  //             const contractData = contracts.find((item: any) =>
  //               item.contractDTO.contractId === id
  //             );

  //             if (contractData && contractData.contractDocumentDTOS) {
  //               setContractDocument(contractData.contractDocumentDTOS);
  //             }
  //           }
  //         } else {
  //           toast.dismiss();
  //           toast.error("Upload Failed", {
  //             description: response.data.message || "Failed to upload document."
  //           });
  //         }
  //       } catch (error) {
  //         toast.dismiss();
  //         toast.error("Upload Failed", {
  //           description: "An error occurred while uploading the document."
  //         });
  //         console.error("Error uploading document:", error);
  //       }
  //     };

  //     // Trigger the file input click
  //     fileInput.click();
  //   } catch (error) {
  //     toast.error("Upload Failed", {
  //       description: "An error occurred while preparing the upload."
  //     });
  //     console.error("Error in upload process:", error);
  //   }
  // };

  // const handleDownloadDocument = (id: number, doc: string) => {
  //   toast.success("Document Downloaded", {
  //     description: `${doc} has been downloaded.`,
  //   });
  //   console.log(id);
  //   console.log(doc);
  // };

  // const getStatusBadge = (status: any) => {
  //   switch (status) {
  //     case "Active":
  //       return (
  //         <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-500">
  //           Active
  //         </span>
  //       );
  //     case "Pending":
  //       return (
  //         <span className="px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-500">
  //           Pending
  //         </span>
  //       );
  //     case "Draft":
  //       return (
  //         <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-500">
  //           Draft
  //         </span>
  //       );
  //     case "Expired":
  //       return (
  //         <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500">
  //           Expired
  //         </span>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  // const getStatusIcon = (status: any) => {
  //   switch (status) {
  //     case "Active":
  //       return <CheckCircle className="h-5 w-5 text-green-500" />;
  //     case "Pending":
  //       return <Clock className="h-5 w-5 text-yellow-500" />;
  //     case "Draft":
  //       return <AlertCircle className="h-5 w-5 text-blue-500" />;
  //     case "Expired":
  //       return <XCircle className="h-5 w-5 text-red-500" />;
  //     default:
  //       return null;
  //   }
  // };

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

  const fetchContractList = async () => {
    try {
      const res: any = await managerApi.getAllContract()
      console.log("Contract List:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setContracts(res.data.result)

        // If we have a selected contract, also set its documents
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

  const openContractModal = (contract: ContractDTO) => {
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

    setIsContractModalOpen(true)
  }

  useEffect(() => {
    if (selectedContract && selectedContract.contractId) {
      setVietQRParams({
        bankID: "BIDV",
        accountID: "31410001689304",
        amount: selectedContract.totalAmount.toString(),
        description: `Payment for contract #${selectedContract.contractId}`,
      })
    }
  }, [selectedContract])

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
            {contracts.map((contractItem) => {
              const contract = contractItem.contractDTO
              return (
                <TableRow key={contract.contractId} className="border-[#333333] hover:bg-[#2A2A2A]">
                  <TableCell className="font-medium text-white">{contract.contractName}</TableCell>
                  <TableCell className="text-white">Company {contract.companyId}</TableCell>
                  <TableCell className="text-white">{contract.contractType}</TableCell>
                  <TableCell className="text-white">{contract.startDate || "N/A"}</TableCell>
                  <TableCell className="text-white">{contract.endDate || "N/A"}</TableCell>
                  <TableCell className="text-white">${contract.totalAmount?.toLocaleString() || "0"}</TableCell>
                  <TableCell className="text-white">{contract.status || "N/A"}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleUploadDocument(contract.contractId)}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload document
                        </DropdownMenuItem>
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
      </main>

      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View and manage the details of the selected contract.</DialogDescription>
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
                    <div>${selectedContract.totalAmount?.toLocaleString() || "0"}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>{selectedContract.status || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Commission</Label>
                    <div>{selectedContract.commission || "Not specified"}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Contract Documents</h3>
                  {contractDocument && contractDocument.length > 0 ? (
                    <ul className="space-y-2">
                      {contractDocument.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between p-2 rounded hover:bg-[#333333]">
                          <div className="flex items-center">
                            {getDocumentIcon(doc.fileName)}
                            <span className="ml-2">{doc.fileName}</span>
                          </div>
                          <div className="flex gap-2 text-black">
                            <Button variant="outline" size="sm" onClick={() => handleViewDocumentDetails(doc.fileName)}>
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
                    <p>No documents uploaded yet.</p>
                  )}
                  <Button className="mt-4" onClick={() => handleUploadDocument(selectedContract.contractId)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Document
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Contract Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 text-right mr-4 text-sm text-gray-500">Start</div>
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      {/* <div className="ml-2">{selectedContract.startDate}</div> */}
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-right mr-4 text-sm text-gray-500">Current</div>
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div className="ml-2">Today</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-right mr-4 text-sm text-gray-500">End</div>
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      {/* <div className="ml-2">{selectedContract.endDate}</div> */}
                    </div>
                  </div>
                  {/* <Progress
                    value={selectedContract.progress}
                    className="w-full mt-4 bg-blue-500"
                  /> */}
                </div>
              </TabsContent>
              <TabsContent value="payment">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4">Contract Payment</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-[#1E1E1E] rounded-lg">
                        <h4 className="text-md font-medium mb-2">Payment Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-400">Contract Value:</div>
                          <div>${selectedContract.totalAmount}</div>
                          <div className="text-gray-400">Payment Status:</div>
                          {/* <div>
                            {selectedContract.progress >= 100
                              ? "Paid"
                              : "Pending"}
                          </div> */}
                          <div className="text-gray-400">Due Date:</div>
                          {/* <div>{selectedContract.endDate}</div> */}
                          <div className="text-gray-400">Bank:</div>
                          <div>{vietQRParams.bankID}</div>
                          <div className="text-gray-400">Account Number:</div>
                          <div>{vietQRParams.accountID}</div>
                          <div className="text-gray-400">Description:</div>
                          <div className="truncate">{vietQRParams.description}</div>
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
          <DialogFooter>
            <Button onClick={() => setIsContractModalOpen(false)}>Close</Button>
          </DialogFooter>
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
              <Button
                variant="outline"
                // onClick={() =>
                //   handleDownloadDocument(selectedContractDocument?.contractDocumentId, selectedDocument)
                // }
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Version
              </Button>
            </div>
            <Button onClick={() => setIsAttachmentModalOpen(false)}>Close</Button>
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

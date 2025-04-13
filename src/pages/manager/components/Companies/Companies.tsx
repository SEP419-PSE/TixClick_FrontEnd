import { Building2, Check, Eye, FileText, Mail, MapPin, MoreHorizontal, Phone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Company } from "../../../../interface/manager/Company"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"

export default function CompanyApprovalsPage() {
  const [companies, setCompanies] = useState<Company[]>([])

  const [selectedCompany, setSelectedCompany] = useState<Company>()
  const [searchTerm, setSearchTerm] = useState("")

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)

  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  // Add state for active tab in review modal
  const [activeReviewTab, setActiveReviewTab] = useState("company-info")

  const handleReviewCompany = (company: any) => {
    setSelectedCompany(company)
    setIsReviewModalOpen(true)
  }

  const handleApproveCompany = async (status: string, companyVerificationId: number) => {
    try {
      setIsApproving(true)

      const response = await managerApi.approveCompany(status, companyVerificationId)
      console.log("Approved successfully:", response)

      await fetchCompaniesList()

      toast.success("Company Approved", {
        description: `${selectedCompany?.companyName} has been approved. An email notification has been sent to the company.`,
      })
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error("Approval failed:", error)
      toast.error("Approval failed", {
        description: "There was an error approving the company. Please try again.",
      })
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectCompany = async () => {
    try {
      setIsRejecting(true)

      await managerApi.approveCompany("REJECTED", selectedCompany?.companyVerificationId ?? 0)

      await fetchCompaniesList()

      toast.success("Company Rejected", {
        description: `${selectedCompany?.companyName} has been rejected. An email notification has been sent to the company.`,
      })
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error("❌ Rejection failed:", error)
      toast.error("Rejection failed", {
        description: "There was an error rejecting the company. Please try again.",
      })
    } finally {
      setIsRejecting(false)
    }
  }


  const handleViewDocuments = (company: Company) => {
    setSelectedCompany(company)
    setIsDocumentModalOpen(true)
  }

  const fetchCompaniesList = async () => {
    try {
      const res: any = await managerApi.getAllCompany()
      console.log("Company List Huy:", res)
      if (res.data.result && res.data.result.length > 0) {
        setCompanies(res.data.result)
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast.error("Failed to fetch companies")
    }
  }

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchCompaniesList()
    }
    initUseEffect()
  }, [])

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.codeTax?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.customAccount.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <ManagerHeader heading="Company Approvals" text="Review and approve pending company accounts" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <Input
            className="w-[300px] bg-[#2A2A2A] text-white"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="text-white text-sm">
            Total: <span className="font-semibold">{filteredCompanies.length}</span> companies
          </div>
        </div>

        <div className="rounded-lg border border-[#333333] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                <TableHead className="text-white w-12 text-center">No</TableHead>
                <TableHead className="text-white">Company Name</TableHead>
                <TableHead className="text-white">Code Tax</TableHead>
                <TableHead className="text-white">Contact Person</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Documents</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <TableRow
                    key={company.companyId}
                    className={`border-[#333333] hover:bg-[#2A2A2A] ${index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"}`}
                  >
                    <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {company.logoURL ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-[#333333] flex items-center justify-center">
                            <img
                              src={company.logoURL || "/placeholder.svg"}
                              alt={company.companyName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#333333] flex items-center justify-center">
                            <Building2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span>{company.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{company.codeTax}</TableCell>
                    <TableCell className="text-white">
                      {company.customAccount.lastName} {company.customAccount.firstName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="max-w-[180px] truncate" title={company.customAccount.email}>
                        {company.customAccount.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          company.status === "ACTIVE"
                            ? "bg-green-900 text-green-300"
                            : company.status === "PENDING"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                        }`}
                      >
                        {company.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">
                      {company.companyDocument && company.companyDocument.length > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-black border-[#444444] hover:bg-[#333333]"
                          onClick={() => handleViewDocuments(company)}
                        >
                          <FileText className="h-4 w-4" />
                          {company.companyDocument.length} Documents
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">No documents</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#333333]">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white border-[#444444]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={() => handleReviewCompany(company)}
                            className="hover:bg-[#333333] cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Review company details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#444444]" />
                          {company.companyDocument && company.companyDocument.length > 0 && (
                            <DropdownMenuItem
                              onSelect={() => handleViewDocuments(company)}
                              className="hover:bg-[#333333] cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View documents
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-white">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-400">No companies found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Bảng detail  */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {selectedCompany?.logoURL && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#333333] flex items-center justify-center">
                  <img
                    src={selectedCompany.logoURL || "/placeholder.svg"}
                    alt={selectedCompany?.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {selectedCompany?.companyName}
              <span className="ml-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCompany?.status === "ACTIVE"
                      ? "bg-green-900 text-green-300"
                      : selectedCompany?.status === "PENDING"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                  }`}
                >
                  {selectedCompany?.status}
                </span>
              </span>
            </DialogTitle>
            <DialogDescription>
              Review the company details and decide whether to approve or reject the application.
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Tabs
              defaultValue="company-info"
              className="w-full"
              onValueChange={setActiveReviewTab}
              value={activeReviewTab}
            >
              <TabsList className="grid grid-cols-2 mb-6 bg-[#333333]">
                <TabsTrigger value="company-info" className="data-[state=active]:bg-[#00B14F]">
                  Company Information
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-[#00B14F]">
                  Documents ({selectedCompany.companyDocument?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="company-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-[#00B14F]" />
                      Company Overview
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Company Name</label>
                        <div className="text-base font-semibold">{selectedCompany.companyName}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Tax Code</label>
                        <div className="text-base">{selectedCompany.codeTax}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Company ID</label>
                        <div className="text-base">{selectedCompany.companyId}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Verification ID</label>
                        <div className="text-base">{selectedCompany.companyVerificationId}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">National ID</label>
                        <div className="text-base">{selectedCompany.nationalId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-[#00B14F]" />
                      Location & Contact
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Address</label>
                        <div className="text-base">{selectedCompany.address}</div>
                      </div>

                      <div className="pt-2 border-t border-[#333333] mt-3">
                        <label className="text-sm font-medium text-gray-400">Contact Person</label>
                        <div className="text-base font-semibold">
                          {selectedCompany.customAccount.lastName} {selectedCompany.customAccount.firstName}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#00B14F]" />
                        <div className="text-base">{selectedCompany.customAccount.email}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#00B14F]" />
                        <div className="text-base">{selectedCompany.customAccount.phoneNumber || "Not provided"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4">Banking Information</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-400">Bank Name</label>
                        <div className="text-base">{selectedCompany.bankingName}</div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-400">Bank Account Number</label>
                        <div className="text-base font-mono">{selectedCompany.bankingCode}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#333333]">
                    <h3 className="text-lg font-semibold mb-4">Company Description</h3>

                    <div>
                      <label className="text-sm font-medium text-gray-400">About</label>
                      <div className="text-base mt-1 whitespace-pre-wrap">{selectedCompany.description}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                {selectedCompany.companyDocument && selectedCompany.companyDocument.length > 0 ? (
                  <div className="border border-[#333333] rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                          <TableHead className="text-white w-12 text-center">#</TableHead>
                          <TableHead className="text-white">Document Name</TableHead>
                          <TableHead className="text-white">Type</TableHead>
                          <TableHead className="text-white">Upload Date</TableHead>
                          <TableHead className="text-white text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCompany.companyDocument.map((doc, index) => (
                          <TableRow
                            key={doc.companyDocumentId}
                            className={`border-[#333333] hover:bg-[#2A2A2A] ${
                              index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"
                            }`}
                          >
                            <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                            <TableCell className="font-medium text-white">{doc.fileName}</TableCell>
                            <TableCell className="text-white">{doc.fileType}</TableCell>
                            <TableCell className="text-white">{formatDate(doc.uploadDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {doc.fileURL && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(doc.fileURL, "_blank")}
                                    className="border-[#444444] hover:bg-[#333333]"
                                  >
                                    <Eye className="h-4 w-4 text-black" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-md border-[#444444]">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">No Documents Found</h3>
                    <p className="text-gray-400">This company hasn't uploaded any documents yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex justify-between mt-6 pt-4 border-t border-[#333333]">
            {selectedCompany && selectedCompany.status === "PENDING" ? (
              <>
                <Button
                  onClick={handleRejectCompany}
                  className="bg-red-500 text-white hover:bg-red-600"
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Rejecting...
                    </span>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" /> Reject Company
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleApproveCompany("APPROVED", selectedCompany?.companyVerificationId ?? 0)}
                  className="bg-[#00B14F] text-white"
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Approving...
                    </span>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Approve Company
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsReviewModalOpen(false)} className="ml-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Company Documents</DialogTitle>
            <DialogDescription>View company documents</DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-4">
              {selectedCompany.companyDocument && selectedCompany.companyDocument.length > 0 ? (
                <div className="border border-[#333333] rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#252525] hover:bg-[#2A2A2A]">
                        <TableHead className="text-white w-12 text-center">No</TableHead>
                        <TableHead className="text-white">Document Name</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Upload Date</TableHead>
                        <TableHead className="text-white text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCompany.companyDocument.map((doc, index) => (
                        <TableRow
                          key={doc.companyDocumentId}
                          className={`border-[#333333] hover:bg-[#2A2A2A] ${index % 2 === 0 ? "bg-[#1E1E1E]" : "bg-[#222222]"}`}
                        >
                          <TableCell className="font-medium text-white text-center">{index + 1}</TableCell>
                          <TableCell className="font-medium text-white">{doc.fileName}</TableCell>
                          <TableCell className="text-white">{doc.fileType}</TableCell>
                          <TableCell className="text-white">{formatDate(doc.uploadDate)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {doc.fileURL && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(doc.fileURL, "_blank")}
                                  className="border-[#444444] hover:bg-[#333333]"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed rounded-md border-[#444444]">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No Documents Found</h3>
                  <p className="text-gray-400">This company doesn't have any documents yet.</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDocumentModalOpen(false)}
              className="text-white border-[#444444] hover:bg-[#333333]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

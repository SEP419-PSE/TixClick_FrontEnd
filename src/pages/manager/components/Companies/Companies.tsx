import { Building2, Check, Eye, FileText, Globe, Mail, MapPin, MoreHorizontal, Phone, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Textarea } from "../../../../components/ui/textarea"
import { Company, Document } from "../../../../interface/manager/Company"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"

export default function CompanyApprovalsPage() {
  const [companies, setCompanies] = useState<Company[]>([])

  const [selectedCompany, setSelectedCompany] = useState<Company>()
  const [searchTerm, setSearchTerm] = useState("")

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)

  const [documents, setDocuments] = useState<Document[]>([])
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: "",
    required: false,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentTab, setDocumentTab] = useState("create")

  const handleReviewCompany = (company: any) => {
    setSelectedCompany(company)
    setIsReviewModalOpen(true)
  }

  const handleApproveCompany = async (status: string, companyVerificationId: number) => {
    try {
        const response = await managerApi.approveCompany(status, companyVerificationId);
        console.log("✅ Approved successfully:", response);

        fetchCompaniesList();

        if (!documents.some((doc) => doc.company_id === selectedCompany?.companyId)) {
            setIsReviewModalOpen(false);
            setIsDocumentModalOpen(true);
        } else {
            completeApproval();
        }
    } catch (error) {
        console.error("❌ Approval failed:", error);
    }
};


  const completeApproval = () => {
    setCompanies(
      companies.map((company) =>
        company.companyId === selectedCompany?.companyId ? { ...company, status: "ACTIVE" } : company,
      ),
    )
    toast.success("Company Approved", {
      description: `${selectedCompany?.companyName} has been approved.`,
    })
    setIsReviewModalOpen(false)
    setIsDocumentModalOpen(false)
  }

  const handleRejectCompany = () => {
    
    toast.success("Company Rejected", {
      description: `${selectedCompany?.companyName} has been rejected.`,
    })
    setIsReviewModalOpen(false)
  }

  const handleCreateDocument = () => {
    if (!newDocument.name) {
      toast.error("Document name is required")
      return
    }

    const newDoc: Document = {
      contract_id: documents.length + 1,
      file_name: newDocument.name,
      file_type: selectedFile?.type.split("/")[1].toUpperCase() || "PDF",
      uploaded_date: new Date().toISOString().split("T")[0],
      company_id: selectedCompany?.companyId || 0,
      file_url: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    }

    setDocuments([...documents, newDoc])
    toast.success("Document created successfully")

    setNewDocument({
      name: "",
      description: "",
      required: false,
    })
    setSelectedFile(null)

    completeApproval()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleViewDocuments = (company: Company) => {
    setSelectedCompany(company)
    setDocumentTab("view")
    setIsDocumentModalOpen(true)
  }

  const handleUploadDocument = (company: Company) => {
    setSelectedCompany(company)
    setDocumentTab("create")
    setIsDocumentModalOpen(true)
  }

  const handleApproveDocument = (docId: number) => {
    setDocuments(documents.map((doc) => (doc.contract_id === docId ? { ...doc, status: "APPROVED" } : doc)))
    toast.success("Document approved")
  }

  const handleRejectDocument = (docId: number) => {
    setDocuments(documents.map((doc) => (doc.contract_id === docId ? { ...doc, status: "REJECTED" } : doc)))
    toast.success("Document rejected")
  }

  const fetchCompaniesList = async () => {
    try {
      const res: any = await managerApi.getAllCompany()
      console.log("Company List:", res.data.result)
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

  const getCompanyDocuments = (companyId: number) => {
    return documents.filter((doc) => doc.company_id === companyId)
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
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
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
            {filteredCompanies.map((company) => {
              const companyDocs = getCompanyDocuments(company.companyId)
              return (
                <TableRow key={company.companyId} className="border-[#333333] hover:bg-[#2A2A2A]">
                  <TableCell className="font-medium text-white">{company.companyName}</TableCell>
                  <TableCell className="text-white">{company.codeTax}</TableCell>
                  <TableCell className="text-white">
                    {company.customAccount.lastName} {company.customAccount.firstName}
                  </TableCell>
                  <TableCell className="text-white">{company.customAccount.email}</TableCell>
                  <TableCell className="text-white">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
                  <TableCell className="text-black">
                    {companyDocs.length > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDocuments(company)}
                      >
                        <FileText className="h-4 w-4" />
                        {companyDocs.length} Documents
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleUploadDocument(company)}
                      >
                        <Upload className="h-4 w-4" />
                        Upload Documents
                      </Button>
                    )}
                  </TableCell>
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
                        <DropdownMenuItem onSelect={() => handleReviewCompany(company)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review company details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuSeparator />
                        
                        
                        <DropdownMenuItem onSelect={() => handleViewDocuments(company)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Manage documents
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </main>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Review Company Application</DialogTitle>
            <DialogDescription>
              Review the company details and decide whether to approve or reject the application.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Company Name</label>
                  <div className="text-lg font-semibold flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.companyName}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Code Tax</Label>
                  <div className="text-lg">{selectedCompany.codeTax}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Company Banking</Label>
                  <div className="text-lg">{selectedCompany.bankingName}: {selectedCompany.bankingCode}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Location</Label>
                  <div className="text-lg flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.address}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-400">Company Description</Label>
                <div className="text-lg">{selectedCompany.description}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-400">Contact Person</Label>
                  <div className="text-lg">
                    {selectedCompany.customAccount.lastName} {selectedCompany.customAccount.firstName}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Email</Label>
                  <div className="text-lg flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.customAccount.email}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Phone</Label>
                  <div className="text-lg flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.customAccount.phoneNumber}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Identity Code</Label>
                  <div className="text-lg flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.nationalId}
                  </div>
                </div>
              </div>
              
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button onClick={handleRejectCompany} className="bg-red-500 text-white hover:bg-red-600">
              <X className="mr-2 h-4 w-4" /> Reject Company
            </Button>
            <Button 
              onClick={() => handleApproveCompany("APPROVED", selectedCompany?.companyVerificationId ?? 0)}
              className="bg-[#00B14F] text-white">
              <Check className="mr-2 h-4 w-4" /> Approve Company
            </Button> 
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Company Documents</DialogTitle>
            <DialogDescription>
              {documentTab === "create"
                ? "Create and upload documents for this company"
                : "View and manage company documents"}
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <Tabs defaultValue={documentTab} onValueChange={setDocumentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="view">View Documents</TabsTrigger>
                <TabsTrigger value="create">Create Document</TabsTrigger>
              </TabsList>

              <TabsContent value="view" className="space-y-4">
                {getCompanyDocuments(selectedCompany.companyId).length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                          <TableHead className="text-white">Document Name</TableHead>
                          <TableHead className="text-white">Type</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Uploaded By</TableHead>
                          <TableHead className="text-white">Date</TableHead>
                          <TableHead className="text-white text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCompanyDocuments(selectedCompany.companyId).map((doc) => (
                          <TableRow key={doc.contract_id} className="border-[#333333] hover:bg-[#2A2A2A]">
                            <TableCell className="font-medium text-white">{doc.file_name}</TableCell>
                            <TableCell className="text-white">{doc.file_type}</TableCell>
                            <TableCell className="text-white">
                             
                            </TableCell>
                            
                            <TableCell className="text-white">
                             Huy
                            </TableCell>
                            <TableCell className="text-white">{doc.uploaded_date}</TableCell>
                            <TableCell className="text-right text-black flex items-center">
                              <div className="flex justify-end gap-2">
                                {doc.file_url && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(doc.file_url, "_blank")}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                {!doc.contract_id && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-500"
                                      onClick={() => handleApproveDocument(doc.contract_id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => handleRejectDocument(doc.contract_id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">No Documents Found</h3>
                    <p className="text-gray-400 mb-4">This company doesn't have any documents yet.</p>
                    <Button onClick={() => setDocumentTab("create")}>Create Document</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="documentName" className="text-sm font-medium">
                      Document Name
                    </Label>
                    <Input
                      id="documentName"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                      className="bg-[#1E1E1E] mt-2"
                      placeholder="Enter document name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentDescription" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="documentDescription"
                      value={newDocument.description}
                      onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                      className="bg-[#1E1E1E] mt-2"
                      placeholder="Enter document description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentFile" className="text-sm font-medium">
                      Upload Document
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input id="documentFile" type="file" onChange={handleFileChange} className="bg-[#1E1E1E]" />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-400">
                        Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>

                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)} className="text-black">
              Cancel
            </Button>
            {documentTab === "create" && (
              <Button onClick={handleCreateDocument} className="bg-[#00B14F] text-white">
                <FileText className="mr-2 h-4 w-4" /> Create Document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


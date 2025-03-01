import { Badge, Building2, Check, Eye, Globe, Mail, MapPin, MoreHorizontal, Phone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Textarea } from "../../../../components/ui/textarea"
import { Company } from "../../../../interface/manager/Company"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"


export default function CompanyApprovalsPage() {
  const [companies, setCompanies] = useState<Company[]>([])

  const [selectedCompany, setSelectedCompany] = useState<Company>()
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([])

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState("")

  const handleReviewCompany = (company:any) => {
    setSelectedCompany(company)
    setIsReviewModalOpen(true)
  }

  const handleApproveCompany = () => {
    setCompanies(companies.filter((company) => company.companyId !== selectedCompany?.companyId))
    toast.success(
       "Company Approved",{
      description: `${selectedCompany?.companyName} has been approved.`,
    })
    setIsReviewModalOpen(false)
    setApprovalNotes("")
  }

  const handleRejectCompany = () => {
    setPendingCompanies(pendingCompanies.filter((company :any) => company.id !== selectedCompany?.companyId))
    toast.success(
      "Company Rejected",{
      description: `${selectedCompany?.companyName} has been rejected.`,
    })
    setIsReviewModalOpen(false)
    setApprovalNotes("")
  }

  const fetchCompaniesList = async () => {
    const res: any = await managerApi.getAllCompany();
    console.log("Comapany List:", res.data.result);
    if (res.data.result && res.data.result.length > 0) {
      setCompanies(res.data.result);
    }
  };
  useEffect(() => {
    const initUseEffect = async () => {
      await fetchCompaniesList();
    };
    initUseEffect();
  }, []);

  return (
    <>
      <ManagerHeader heading="Company Approvals" text="Review and approve pending company accounts" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <Input className="w-[300px] bg-[#2A2A2A] text-white" placeholder="Search companies..." />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
              <TableHead className="text-white">Company Name</TableHead>
              <TableHead className="text-white">Code Tax</TableHead>
              <TableHead className="text-white">Contact Person</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.companyId} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{company.companyName}</TableCell>
                <TableCell className="text-white">{company.codeTax}</TableCell>
                <TableCell className="text-white">{company.accountDTO.lastName}{company.accountDTO.firstName}</TableCell>
                <TableCell className="text-white">{company.accountDTO.email}</TableCell>

                <TableCell className="text-white">
                  <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
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
                      <DropdownMenuItem className="text-green-500" onSelect={() => handleReviewCompany(company)}>
                        <Check className="mr-2 h-4 w-4" />
                        Approve company
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500" onSelect={() => handleReviewCompany(company)}>
                        <X className="mr-2 h-4 w-4" />
                        Reject company
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
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
                  <Label className="text-sm font-medium text-gray-400">Company Size</Label>
                  <div className="text-lg">{selectedCompany.nationalId} employees</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Location</Label>
                  <div className="text-lg flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.companyName}
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
                  <div className="text-lg">{selectedCompany.accountDTO.lastName}{selectedCompany.accountDTO.firstName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Email</Label>
                  <div className="text-lg flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.accountDTO.email}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Phone</Label>
                  <div className="text-lg flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-[#00B14F]" />
                    {selectedCompany.accountDTO.phone}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-400">Website</Label>
                  <div className="text-lg flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-[#00B14F]" />
                    <a
                      href={selectedCompany.logoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {selectedCompany.accountDTO.userName}
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="approvalNotes" className="text-sm font-medium text-gray-400">
                  Approval Notes
                </Label>
                <Textarea
                  id="approvalNotes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="bg-[#1E1E1E] mt-2"
                  placeholder="Enter any notes regarding the approval or rejection..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button onClick={handleRejectCompany} className="bg-red-500 text-white hover:bg-red-600">
              <X className="mr-2 h-4 w-4" /> Reject Company
            </Button>
            <Button onClick={handleApproveCompany} className="bg-[#00B14F] text-white">
              <Check className="mr-2 h-4 w-4" /> Approve Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


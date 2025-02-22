// "use client"

// import { useState } from "react"
// import { Check, X, Eye, MoreHorizontal, Building2, Mail, Phone, Globe, MapPin } from "lucide-react"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { DashboardHeader } from "@/components/dashboard-header"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"
// import { Input } from "../../../../components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
// import { Button } from "../../../../components/ui/button"

// export default function CompanyApprovalsPage() {
//   const [pendingCompanies, setPendingCompanies] = useState([
//     {
//       id: 1,
//       name: "TechNova Solutions",
//       industry: "Information Technology",
//       size: "50-100",
//       location: "San Francisco, CA",
//       contactPerson: "John Doe",
//       email: "john.doe@technova.com",
//       phone: "+1 (555) 123-4567",
//       website: "https://www.technova.com",
//       description:
//         "TechNova Solutions is a cutting-edge IT company specializing in AI and machine learning solutions for businesses.",
//       status: "Pending",
//     },
//     {
//       id: 2,
//       name: "GreenLeaf Innovations",
//       industry: "Environmental Technology",
//       size: "20-50",
//       location: "Portland, OR",
//       contactPerson: "Jane Smith",
//       email: "jane.smith@greenleaf.com",
//       phone: "+1 (555) 987-6543",
//       website: "https://www.greenleaf.com",
//       description:
//         "GreenLeaf Innovations develops sustainable technologies to help businesses reduce their carbon footprint.",
//       status: "Pending",
//     },
//     {
//       id: 3,
//       name: "MediCare Plus",
//       industry: "Healthcare",
//       size: "100-250",
//       location: "Boston, MA",
//       contactPerson: "Robert Johnson",
//       email: "robert.johnson@medicareplus.com",
//       phone: "+1 (555) 246-8135",
//       website: "https://www.medicareplus.com",
//       description:
//         "MediCare Plus is a healthcare technology company focused on improving patient care through innovative software solutions.",
//       status: "Pending",
//     },
//   ])

//   const [selectedCompany, setSelectedCompany] = useState(null)
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
//   const [approvalNotes, setApprovalNotes] = useState("")

//   const handleReviewCompany = (company) => {
//     setSelectedCompany(company)
//     setIsReviewModalOpen(true)
//   }

//   const handleApproveCompany = () => {
//     // In a real application, this would update the database
//     setPendingCompanies(pendingCompanies.filter((company) => company.id !== selectedCompany.id))
//     toast({
//       title: "Company Approved",
//       description: `${selectedCompany.name} has been approved.`,
//     })
//     setIsReviewModalOpen(false)
//     setApprovalNotes("")
//   }

//   const handleRejectCompany = () => {
//     // In a real application, this would update the database
//     setPendingCompanies(pendingCompanies.filter((company) => company.id !== selectedCompany.id))
//     toast({
//       title: "Company Rejected",
//       description: `${selectedCompany.name} has been rejected.`,
//     })
//     setIsReviewModalOpen(false)
//     setApprovalNotes("")
//   }

//   return (
//     <>
//       <DashboardHeader heading="Company Approvals" text="Review and approve pending company accounts" />
//       <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
//         <div className="flex justify-between items-center mb-6">
//           <Input className="w-[300px] bg-[#2A2A2A] text-white" placeholder="Search companies..." />
//         </div>
//         <Table>
//           <TableHeader>
//             <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
//               <TableHead className="text-white">Company Name</TableHead>
//               <TableHead className="text-white">Industry</TableHead>
//               <TableHead className="text-white">Location</TableHead>
//               <TableHead className="text-white">Contact Person</TableHead>
//               <TableHead className="text-white">Status</TableHead>
//               <TableHead className="text-white text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {pendingCompanies.map((company) => (
//               <TableRow key={company.id} className="border-[#333333] hover:bg-[#2A2A2A]">
//                 <TableCell className="font-medium text-white">{company.name}</TableCell>
//                 <TableCell className="text-white">{company.industry}</TableCell>
//                 <TableCell className="text-white">{company.location}</TableCell>
//                 <TableCell className="text-white">{company.contactPerson}</TableCell>
//                 <TableCell className="text-white">
//                   <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" className="h-8 w-8 p-0">
//                         <span className="sr-only">Open menu</span>
//                         <MoreHorizontal className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
//                       <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                       <DropdownMenuItem onSelect={() => handleReviewCompany(company)}>
//                         <Eye className="mr-2 h-4 w-4" />
//                         Review company details
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem className="text-green-500" onSelect={() => handleReviewCompany(company)}>
//                         <Check className="mr-2 h-4 w-4" />
//                         Approve company
//                       </DropdownMenuItem>
//                       <DropdownMenuItem className="text-red-500" onSelect={() => handleReviewCompany(company)}>
//                         <X className="mr-2 h-4 w-4" />
//                         Reject company
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </main>

//       <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
//         <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Review Company Application</DialogTitle>
//             <DialogDescription>
//               Review the company details and decide whether to approve or reject the application.
//             </DialogDescription>
//           </DialogHeader>
//           {selectedCompany && (
//             <div className="grid gap-6 py-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Company Name</Label>
//                   <div className="text-lg font-semibold flex items-center">
//                     <Building2 className="mr-2 h-5 w-5 text-[#00B14F]" />
//                     {selectedCompany.name}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Industry</Label>
//                   <div className="text-lg">{selectedCompany.industry}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Company Size</Label>
//                   <div className="text-lg">{selectedCompany.size} employees</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Location</Label>
//                   <div className="text-lg flex items-center">
//                     <MapPin className="mr-2 h-5 w-5 text-[#00B14F]" />
//                     {selectedCompany.location}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <Label className="text-sm font-medium text-gray-400">Company Description</Label>
//                 <div className="text-lg">{selectedCompany.description}</div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Contact Person</Label>
//                   <div className="text-lg">{selectedCompany.contactPerson}</div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Email</Label>
//                   <div className="text-lg flex items-center">
//                     <Mail className="mr-2 h-5 w-5 text-[#00B14F]" />
//                     {selectedCompany.email}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Phone</Label>
//                   <div className="text-lg flex items-center">
//                     <Phone className="mr-2 h-5 w-5 text-[#00B14F]" />
//                     {selectedCompany.phone}
//                   </div>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium text-gray-400">Website</Label>
//                   <div className="text-lg flex items-center">
//                     <Globe className="mr-2 h-5 w-5 text-[#00B14F]" />
//                     <a
//                       href={selectedCompany.website}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-400 hover:underline"
//                     >
//                       {selectedCompany.website}
//                     </a>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="approvalNotes" className="text-sm font-medium text-gray-400">
//                   Approval Notes
//                 </Label>
//                 <Textarea
//                   id="approvalNotes"
//                   value={approvalNotes}
//                   onChange={(e) => setApprovalNotes(e.target.value)}
//                   className="bg-[#1E1E1E] mt-2"
//                   placeholder="Enter any notes regarding the approval or rejection..."
//                   rows={4}
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter className="flex justify-between">
//             <Button onClick={handleRejectCompany} className="bg-red-500 text-white hover:bg-red-600">
//               <X className="mr-2 h-4 w-4" /> Reject Company
//             </Button>
//             <Button onClick={handleApproveCompany} className="bg-[#00B14F] text-white">
//               <Check className="mr-2 h-4 w-4" /> Approve Company
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }


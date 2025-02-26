"use client"

import { Label } from "@headlessui/react"
import {
  AlertCircle,
  Badge,
  Bell,
  CheckCircle,
  Clock,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Progress } from "../../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Contracts } from "../../../../interface/manager/Contracts"


export default function ContractsPage() {
  const [contracts, setContracts] = useState([
    {
      id: 1,
      name: "Service Agreement - Acme Inc",
      company: "Acme Inc",
      type: "Service Agreement",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      value: 100000,
      status: "Active",
      progress: 50,
      documents: ["contract.pdf", "terms.pdf"],
    },
    {
      id: 2,
      name: "Licensing Deal - Globex",
      company: "Globex Corporation",
      type: "Licensing Agreement",
      startDate: "2023-03-15",
      endDate: "2024-03-14",
      value: 250000,
      status: "Active",
      progress: 25,
      documents: ["license.pdf"],
    },
    {
      id: 3,
      name: "Partnership Agreement - Initech",
      company: "Initech",
      type: "Partnership Agreement",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      value: 500000,
      status: "Pending",
      progress: 0,
      documents: ["partnership.pdf", "terms.pdf"],
    },
    {
      id: 4,
      name: "Maintenance Contract - Umbrella",
      company: "Umbrella Corporation",
      type: "Maintenance Agreement",
      startDate: "2023-09-01",
      endDate: "2024-08-31",
      value: 75000,
      status: "Active",
      progress: 10,
      documents: ["maintenance.pdf"],
    },
    {
      id: 5,
      name: "Consulting Services - Soylent",
      company: "Soylent Corp",
      type: "Consulting Agreement",
      startDate: "2023-11-01",
      endDate: "2024-10-31",
      value: 150000,
      status: "Draft",
      progress: 0,
      documents: [],
    },
  ])

  const [newContract, setNewContract] = useState({
    name: "",
    company: "",
    type: "",
    startDate: "",
    endDate: "",
    value: "",
    status: "Draft",
  })

  const [selectedContract, setSelectedContract] = useState<Contracts>({
    id: 1,
    name: "",
    company: "",
    type: "",
    startDate: "",
    endDate: "",
    value: 0,
    status: "",
    progress: 0,
    documents: [
    ],

  })
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)

  const handleAddContract = () => {
    setContracts([
      ...contracts,
      {
        ...newContract,
        id: contracts.length + 1,
        value: Number.parseFloat(newContract.value),
        progress: 0,
        documents: [],
      },
    ])
    setNewContract({ name: "", company: "", type: "", startDate: "", endDate: "", value: "", status: "Draft" })
    toast.success("Contract Added", {
      description: "The new contract has been successfully added.",
    });
  }

  const handleUploadDocument = (id :any) => {
    toast.success("Document Uploaded", {
      description: "The document has been successfully uploaded.",
      
    });
    console.log(id)
  }

  const handleDownloadDocument = (id:number, doc:string) => {
    toast.success(
      "Document Downloaded",{
      description: `${document} has been downloaded.`,
    })
    console.log(id);
    console.log(doc);
  }

  const getStatusBadge = (status : any ) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500/20 text-green-500">Active</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
      case "Draft":
        return <Badge className="bg-blue-500/20 text-blue-500">Draft</Badge>
      case "Expired":
        return <Badge className="bg-red-500/20 text-red-500">Expired</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status:any) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Draft":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case "Expired":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <>
      {/* <ManagerHeader heading="Contracts" text="Manage and track all contracts" /> */}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#00B14F] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Contract
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2A2A2A] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Contract</DialogTitle>
                  <DialogDescription>Enter the details of the new contract here.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Contract Name
                    </Label>
                    <Input
                      id="name"
                      value={newContract.name}
                      onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={newContract.company}
                      onChange={(e) => setNewContract({ ...newContract, company: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Contract Type
                    </Label>
                    <Select onValueChange={(value) => setNewContract({ ...newContract, type: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                        <SelectItem value="Licensing Agreement">Licensing Agreement</SelectItem>
                        <SelectItem value="Partnership Agreement">Partnership Agreement</SelectItem>
                        <SelectItem value="Maintenance Agreement">Maintenance Agreement</SelectItem>
                        <SelectItem value="Consulting Agreement">Consulting Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newContract.startDate}
                      onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newContract.endDate}
                      onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="value" className="text-right">
                      Contract Value
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={newContract.value}
                      onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddContract} className="bg-[#00B14F] text-white">
                    Add Contract
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              <TableHead className="text-white">Progress</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{contract.name}</TableCell>
                <TableCell className="text-white">{contract.company}</TableCell>
                <TableCell className="text-white">{contract.type}</TableCell>
                <TableCell className="text-white">{contract.startDate}</TableCell>
                <TableCell className="text-white">{contract.endDate}</TableCell>
                <TableCell className="text-white">${contract.value.toLocaleString()}</TableCell>
                <TableCell className="text-white">{getStatusBadge(contract.status)}</TableCell>
                <TableCell className="text-white">
                  <Progress value={contract.progress} className="w-[60px]" />
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
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedContract(contract)
                          setIsContractModalOpen(true)
                        }}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleUploadDocument(contract.id)}>
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
            ))}
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Contract Name</Label>
                    <div>{selectedContract.name}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Company</Label>
                    <div>{selectedContract.company}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <div>{selectedContract.type}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Start Date</Label>
                    <div>{selectedContract.startDate}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">End Date</Label>
                    <div>{selectedContract.endDate}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Value</Label>
                    <div>${selectedContract.value.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div className="flex items-center">
                      {getStatusIcon(selectedContract.status)}
                      <span className="ml-2">{selectedContract.status}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Progress</Label>
                    <Progress value={selectedContract.progress} className="w-[200px]" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Contract Documents</h3>
                  {selectedContract.documents.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedContract.documents.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{doc}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(selectedContract.id, doc)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No documents uploaded yet.</p>
                  )}
                  <Button className="mt-4" onClick={() => handleUploadDocument(selectedContract.id)}>
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
                      <div className="ml-2">{selectedContract.startDate}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-right mr-4 text-sm text-gray-500">Current</div>
                      <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      <div className="ml-2">Today</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 text-right mr-4 text-sm text-gray-500">End</div>
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <div className="ml-2">{selectedContract.endDate}</div>
                    </div>
                  </div>
                  <Progress value={selectedContract.progress} className="w-full mt-4 bg-blue-500" />

                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setIsContractModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


import { AlertCircle, CheckCircle, Download, Eye, FileText, Filter, Loader2, MoreHorizontal, Search, Upload, XCircle } from "lucide-react"
import * as pdfjs from "pdfjs-dist"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { createWorker } from "tesseract.js"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Progress } from "../../../../components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { EventResponse } from "../../../../interface/manager/EventType"
import managerApi from "../../../../services/manager/ManagerApi"
import { ManagerHeader } from "../ManagerHeader"



const eventTypes = [
  "Conference",
  "Seminar",
  "Workshop",
  "Networking",
  "Product Launch",
  "Trade Show",
  "Webinar",
  "Hackathon",
]

interface ContractData {
  contractName?: string
  contractAmount?: string
  contractDate?: string
  clientName?: string
  clientAddress?: string
  [key: string]: any
}

interface TemplateRegion {
  name: string
  x: number
  y: number
  width: number
  height: number
  displayName: string
}

const templateRegions: TemplateRegion[] = [
  {
    name: "contractName",
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.05,
    displayName: "Tên hợp đồng",
  },
  {
    name: "contractAmount",
    x: 0.5,
    y: 0.3,
    width: 0.4,
    height: 0.05,
    displayName: "Số tiền hợp đồng",
  },
  {
    name: "contractDate",
    x: 0.6,
    y: 0.15,
    width: 0.3,
    height: 0.05,
    displayName: "Ngày hợp đồng",
  },
  {
    name: "clientName",
    x: 0.1,
    y: 0.2,
    width: 0.4,
    height: 0.05,
    displayName: "Tên khách hàng",
  },
  {
    name: "clientAddress",
    x: 0.1,
    y: 0.25,
    width: 0.8,
    height: 0.05,
    displayName: "Địa chỉ khách hàng",
  },
]

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponse[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [selectedEvent, setSelectedEvent] = useState<EventResponse>()
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [relatedContracts, setRelatedContracts] = useState<any[]>([])
  const [isRelatedContractsModalOpen, setIsRelatedContractsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")

  // Contract Scanner State
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<ContractData>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("upload")
  const [showRegions, setShowRegions] = useState(false)
  const [calibratedRegions, _] = useState<TemplateRegion[]>(templateRegions)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pdfDocument, setPdfDocument] = useState<any>(null)
  const [fileType, setFileType] = useState<string>("")

  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchEventList = async () => {
    try {
      const res: any = await managerApi.getAllEvent()
      console.log("Event List:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setEvents(res.data.result)
      }
    } catch (error) {
      console.error("Error fetching contract:", error)
      toast.error("Failed to fetch contract")
    }
  }

  // Update the fetchRelatedContracts function to use the correct API endpoint
  const fetchRelatedContracts = async (eventId: number) => {
    try {
      // Use the correct API endpoint to get contract documents by event ID
      const res: any = await managerApi.getContractsByEventId(eventId)
      console.log("Related Contract Documents:", res.data.result)
      if (res.data.result && res.data.result.length > 0) {
        setRelatedContracts(res.data.result)
      } else {
        setRelatedContracts([])
      }
    } catch (error) {
      console.error("Error fetching related contract documents:", error)
      toast.error("Failed to fetch related contract documents")
      setRelatedContracts([])
    }
  }

  useEffect(() => {
    const initUseEffect = async () => {
      await fetchEventList()
    }
    initUseEffect()
  }, [])

  // Handle file drop for contract scanner
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFile(file)

      // Determine file type
      const fileType = file.type
      setFileType(fileType)

      if (fileType === "application/pdf") {
        // Handle PDF files
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result as ArrayBuffer
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
            setPdfDocument(pdf)
            setTotalPages(pdf.numPages)

            // Render first page
            const page = await pdf.getPage(1)
            const viewport = page.getViewport({ scale: 1.5 })

            // Create a canvas for rendering
            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            canvas.height = viewport.height
            canvas.width = viewport.width

            // Render PDF page to canvas
            await page.render({
              canvasContext: context!,
              viewport: viewport,
            }).promise

            // Convert canvas to data URL
            setPreview(canvas.toDataURL("image/png"))
            setCurrentPage(1)
          } catch (error) {
            console.error("Error loading PDF:", error)
            toast.error("PDF Error", {
              description: "Could not load the PDF file. Please try another file.",
            })
          }
        }
        reader.readAsArrayBuffer(file)
      } else if (
        fileType === "application/msword" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle DOC/DOCX files - show message that server processing is required
        toast.error("Document Format", {
          description: "DOC/DOCX files require server-side processing. Please convert to PDF first.",
        })
        return
      } else {
        // Unsupported file type
        toast.error("Unsupported Format", {
          description: "Only PDF and DOC/DOCX files are supported.",
        })
        return
      }

      setActiveTab("preview")
      setExtractedData({})
    }
  }, [])

  // Change PDF page
  const changePdfPage = async (newPage: number) => {
    if (!pdfDocument || newPage < 1 || newPage > totalPages) return

    try {
      const page = await pdfDocument.getPage(newPage)
      const viewport = page.getViewport({ scale: 1.5 })

      // Create a canvas for rendering
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.height = viewport.height
      canvas.width = viewport.width

      // Render PDF page to canvas
      await page.render({
        canvasContext: context!,
        viewport: viewport,
      }).promise

      // Convert canvas to data URL
      setPreview(canvas.toDataURL("image/png"))
      setCurrentPage(newPage)
    } catch (error) {
      console.error("Error changing PDF page:", error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  })

  // Draw template regions on the image
  const drawRegions = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const image = imageRef.current
    const container = containerRef.current

    // Set canvas dimensions to match the image
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate scale factors
    const scaleX = canvas.width / image.naturalWidth
    const scaleY = canvas.height / image.naturalHeight

    // Draw each region
    calibratedRegions.forEach((region) => {
      const x = region.x * image.naturalWidth * scaleX
      const y = region.y * image.naturalHeight * scaleY
      const width = region.width * image.naturalWidth * scaleX
      const height = region.height * image.naturalHeight * scaleY

      // Draw rectangle
      ctx.strokeStyle = "#00a8ff"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Draw label
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(x, y - 20, region.displayName.length * 8, 20)
      ctx.fillStyle = "#ffffff"
      ctx.font = "12px Arial"
      ctx.fillText(region.displayName, x + 5, y - 5)
    })
  }, [calibratedRegions])

  // Process the document with OCR for specific regions
  const processDocument = async () => {
    if (!file || !imageRef.current) return

    setIsProcessing(true)
    setProgress(0)
    setActiveTab("extract")

    try {
      // Initialize Tesseract worker
      const worker = await (createWorker as any)({
        logger: (m: { status: string; progress?: number }) => {
          if (m.status === "recognizing text" && m.progress !== undefined) {
            setProgress(m.progress * 100)
          }
        },
      })

      await (worker as any).loadLanguage("vie+eng")
      await (worker as any).initialize("vie+eng")

      const image = imageRef.current
      const extractedData: ContractData = {}

      // Process each region
      for (const region of calibratedRegions) {
        // Calculate actual pixel coordinates
        const x = Math.floor(region.x * image.naturalWidth)
        const y = Math.floor(region.y * image.naturalHeight)
        const width = Math.floor(region.width * image.naturalWidth)
        const height = Math.floor(region.height * image.naturalHeight)

        // For PDF or image, we use the current preview image
        const { data } = await worker.recognize(image.src, {
          rectangle: { left: x, top: y, width, height },
        })

        // Clean up the extracted text
        let text = data.text.trim()

        // Apply specific formatting for contract amount
        if (region.name === "contractAmount") {
          // Extract only numbers and decimal points
          text = text.replace(/[^0-9,.]/g, "")
          // Format as currency if needed
          if (text) {
            try {
              const numericValue = Number.parseFloat(text.replace(/,/g, ""))
              text = numericValue.toLocaleString("vi-VN") + " VNĐ"
            } catch (e) {
              // Keep original if parsing fails
            }
          }
        }

        extractedData[region.name] = text
      }

      await worker.terminate()
      setExtractedData(extractedData)
      setProgress(100)
      setIsProcessing(false)

      toast.success("Xử lý hoàn tất", {
        description: "Thông tin hợp đồng đã được trích xuất thành công.",
      })
    } catch (error) {
      console.error("Lỗi khi xử lý tài liệu:", error)
      setIsProcessing(false)

      toast.error("Lỗi xử lý", {
        description: "Đã xảy ra lỗi khi xử lý tài liệu của bạn. Vui lòng thử lại.",
      })
    }
  }

  // Send extracted contract data to backend
  const saveContractData = async () => {
    try {
      setIsProcessing(true)

      // Example API call - replace with your actual endpoint
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: selectedEvent?.eventId,
          eventName: selectedEvent?.eventName,
          originalFilename: file?.name,
          fileType: fileType,
          extractedData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save contract data")
      }

      await response.json()

      toast.success("Contract Created", {
        description: "The contract has been successfully created and linked to the event.",
      })

      setIsContractModalOpen(false)

      // Reset scanner state
      setFile(null)
      setPreview(null)
      setExtractedData({})
      setActiveTab("upload")
      setShowRegions(false)
      setPdfDocument(null)
    } catch (error) {
      console.error("Error saving contract data:", error)

      toast.error("Submission Error", {
        description: "There was an error saving the contract data. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    let result = events.filter((event) =>
      Object.values(event).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
    )

    if (filterStatus !== "all") {
      result = result.filter((event) => event.status === filterStatus)
    }

    if (filterType !== "all") {
      result = result.filter((event) => event.typeEvent === filterType)
    }

    result.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredEvents(result)
  }, [searchQuery, events, filterStatus, filterType, sortBy, sortOrder])

  // Handle image load for contract scanner
  const handleImageLoad = () => {
    if (showRegions) {
      drawRegions()
    }
  }

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "DRAFT":
        return <span className="px-2 py-1 bg-slate-300 text-black rounded-md">Draft</span>
      case "SCHEDULED":
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-md">Scheduled</span>
      case "PENDING_APPROVAL":
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-md">Pending</span>
      case "COMPLETED":
        return <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded-md">Pending</span>
      default:
        return null
    }
  }

  const handleApprove = async (status: string, id: number) => {
    if (!selectedEvent) return

    try {
      const response = await managerApi.approveEvent(status, id)
      console.log("✅ Approved successfully:", response)

      const updatedEvents = events.map((event) =>
        event.eventId === selectedEvent.eventId ? { ...event, status: "APPROVED" } : event,
      )

      setEvents(updatedEvents)
      setSelectedEvent({ ...selectedEvent, status: "APPROVED" })

      toast.success("Event Approved", {
        description: "The event has been successfully approved.",
      })
    } catch (error: any) {
      console.error("❌ Error approving event:", error)

      toast.error("Approval Failed", {
        description: error?.response?.data?.message || "Something went wrong.",
      })
    }
  }

  const handleReject = () => {
    if (!selectedEvent) return

    const updatedEvents = events.map((event) =>
      event.eventId === selectedEvent.eventId ? { ...event, status: "REJECTED" } : event,
    )

    setEvents(updatedEvents)
    setSelectedEvent({ ...selectedEvent, status: "REJECTED" })

    toast.success("Event Rejected", {
      description: "The event has been rejected.",
    })
  }

  const handleCreateContract = () => {
    setIsContractModalOpen(true)
    setActiveTab("upload")
    setFile(null)
    setPreview(null)
    setExtractedData({})
    setShowRegions(false)
    setPdfDocument(null)
  }

  const handleViewRelatedContracts = async () => {
    if (!selectedEvent) return

    await fetchRelatedContracts(selectedEvent.eventId)
    setIsRelatedContractsModalOpen(true)
  }

  return (
    <>
      <ManagerHeader heading="Events" text="Manage and view all events" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              className="w-[300px] bg-[#2A2A2A] text-white"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-[#2A2A2A] text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#2A2A2A] text-white">
                <DropdownMenuItem onClick={() => setSortBy("date")}>Date</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => setSortBy("attendees")}>Attendees</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
              <TableHead className="text-white">Event Name</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Location</TableHead>
              <TableHead className="text-white">Organizer</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.eventId} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{event.eventName}</TableCell>
                <TableCell className="text-white">{event.eventName}</TableCell>
                <TableCell className="text-white">{event.location}</TableCell>
                <TableCell className="text-white">{event.companyName}</TableCell>
                <TableCell className="text-white">{event.typeEvent}</TableCell>
                <TableCell className="text-white">{getStatusBadge(event.status)}</TableCell>
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
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsEventModalOpen(true)
                        }}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit event information</DropdownMenuItem>
                      {/* <DropdownMenuItem>Manage attendees</DropdownMenuItem> */}
                      <DropdownMenuItem>View associated contracts</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Cancel event</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>

      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>View and manage the details of the selected event.</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                {/* <TabsTrigger value="attendees">Attendees</TabsTrigger> */}
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Event Name</Label>
                    <div>{selectedEvent.eventName}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Location</Label>
                    <div>{selectedEvent.location}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Organizer</Label>
                    <div>{selectedEvent.organizerName}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <div>{selectedEvent.typeEvent}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    {/* <div>{selectedEvent.description}</div> */}
                  </div>
                </div>
              </TabsContent>
              {/* <TabsContent value="attendees">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Attendee Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#1E1E1E] text-white">
                      <CardHeader>
                        <CardTitle>Total Attendees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">{selectedEvent.attendees}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1E1E1E] text-white">
                      <CardHeader>
                        <CardTitle>Speakers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5">
                          {selectedEvent.speakers.map((speaker, index) => (
                            <li key={index}>{speaker}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent> */}
              {/* <TabsContent value="budget">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Budget Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#1E1E1E] text-white">
                      <CardHeader>
                        <CardTitle>Total Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">${selectedEvent.budget.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1E1E1E] text-white">
                      <CardHeader>
                        <CardTitle>Sponsors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5">
                          {selectedEvent.sponsors.map((sponsor, index) => (
                            <li key={index}>{sponsor}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent> */}
            </Tabs>
          )}
          <DialogFooter>
            <div className="flex gap-2">
              {selectedEvent?.status === "PENDING_APPROVAL" && (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApprove("SCHEDULED", selectedEvent?.eventId ?? 0)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </>
              )}
              {selectedEvent?.status === "SCHEDULED" && (
                <>
                  <Button onClick={handleCreateContract} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <FileText className="mr-2 h-4 w-4" /> Create Contract
                  </Button>
                  <Button onClick={handleViewRelatedContracts} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <FileText className="mr-2 h-4 w-4" /> View Contracts
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Scanner Dialog - Replaced the old contract creation dialog */}
      <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Scanner</DialogTitle>
            <DialogDescription>Scan and extract contract information for: {selectedEvent?.eventName}</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="preview" disabled={!file}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="extract" disabled={!file}>
                Extract Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">Drag & drop your contract</h3>
                <p className="text-sm text-muted-foreground mb-4">Support for PDF and DOC/DOCX files only (max 10MB)</p>
                <Button type="button" variant="secondary" className="mx-auto">
                  <Upload className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              {file && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-muted/30">
                    {preview && (
                      <div className="aspect-[3/4] relative" ref={containerRef}>
                        <img
                          ref={imageRef}
                          src={preview || "/placeholder.svg"}
                          alt="Document preview"
                          className="object-contain w-full h-full"
                          onLoad={handleImageLoad}
                        />
                        {showRegions && (
                          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* PDF Navigation Controls */}
                  {fileType === "application/pdf" && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePdfPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changePdfPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 text-black">
                    <Button onClick={() => setShowRegions(!showRegions)} variant="outline">
                      {showRegions ? "Hide Regions" : "Show Regions"}
                    </Button>

                    <Button onClick={processDocument} disabled={isProcessing} className="ml-auto">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Extract Contract Information</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="extract" className="mt-6">
              {isProcessing ? (
                <div className="space-y-4 py-8">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <h3 className="text-center font-medium">Processing your document...</h3>
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    This may take a minute depending on the document size and complexity
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.keys(extractedData).length > 0 ? (
                    <>
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          Extracted Information
                        </h3>

                        <div className="space-y-3">
                          {calibratedRegions.map((region) => (
                            <div key={region.name} className="grid grid-cols-3 gap-4">
                              <div className="font-medium text-muted-foreground">{region.displayName}:</div>
                              <div className="col-span-2">{extractedData[region.name] || "Not found"}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={saveContractData} disabled={isProcessing} className="w-full">
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>Save Contract</>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">No data extracted</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We couldn't extract structured data from this document. Try processing again or use a clearer
                        scan.
                      </p>
                      <Button className="text-black" onClick={processDocument} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              className="text-black"
              variant="outline"
              onClick={() => {
                setIsContractModalOpen(false)
                setFile(null)
                setPreview(null)
                setExtractedData({})
                setActiveTab("upload")
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Related Contracts Dialog */}
      <Dialog open={isRelatedContractsModalOpen} onOpenChange={setIsRelatedContractsModalOpen}>
        <DialogContent className="bg-[#2A2A2A] text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Related Contracts</DialogTitle>
            <DialogDescription>Contracts associated with: {selectedEvent?.eventName}</DialogDescription>
          </DialogHeader>

          {relatedContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
                  <TableHead className="text-white">File Name</TableHead>
                  <TableHead className="text-white">File Type</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Upload Date</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedContracts.map((document) => (
                  <TableRow key={document.contractDocumentId} className="border-[#333333] hover:bg-[#2A2A2A]">
                    <TableCell className="font-medium text-white">{document.fileName}</TableCell>
                    <TableCell className="text-white">{document.fileType}</TableCell>
                    <TableCell className="text-white">{document.status}</TableCell>
                    <TableCell className="text-white">
                      {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : "N/A"}
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
                          {document.fileURL && (
                            <DropdownMenuItem onClick={() => window.open(document.fileURL, "_blank")}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Document
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => window.open(document.fileURL, "_blank")}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Contract Documents Found</h3>
              <p className="text-sm text-gray-400 mb-4">
                There are no contract documents associated with this event yet.
              </p>
              {selectedEvent?.status === "SCHEDULED" && (
                <Button
                  onClick={() => {
                    setIsRelatedContractsModalOpen(false)
                    handleCreateContract()
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" /> Create Contract
                </Button>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsRelatedContractsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}







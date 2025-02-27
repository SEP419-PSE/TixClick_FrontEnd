"use client"

import { Badge, Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { SelectedEvent } from "../../../../interface/manager/EventType"
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

export default function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Conference 2023",
      date: "2023-09-15",
      location: "San Francisco, CA",
      organizer: "Acme Inc",
      attendees: 500,
      status: "Upcoming",
      type: "Conference",
      description: "Annual tech conference showcasing the latest innovations in AI and machine learning.",
      budget: 100000,
      sponsors: ["TechCorp", "InnovateCo", "FutureTech"],
      speakers: ["John Doe", "Jane Smith", "Alice Johnson"],
    },
    {
      id: 2,
      name: "Marketing Summit",
      date: "2023-10-01",
      location: "New York, NY",
      organizer: "Globex Corporation",
      attendees: 300,
      status: "Upcoming",
      type: "Seminar",
      description: "A summit for marketing professionals to discuss the latest trends and strategies.",
      budget: 75000,
      sponsors: ["AdTech", "MarketPro", "BrandBoost"],
      speakers: ["Bob Williams", "Emma Davis", "Michael Brown"],
    },
    {
      id: 3,
      name: "Product Launch",
      date: "2023-11-10",
      location: "London, UK",
      organizer: "Initech",
      attendees: 1000,
      status: "Planning",
      type: "Product Launch",
      description: "Launching our revolutionary new product to the European market.",
      budget: 200000,
      sponsors: ["InvestGroup", "MediaMax", "TechVentures"],
      speakers: ["Sarah Connor", "David Martinez", "Emily Chang"],
    },
    {
      id: 4,
      name: "Annual Gala",
      date: "2023-12-05",
      location: "Paris, France",
      organizer: "Umbrella Corporation",
      attendees: 750,
      status: "Planning",
      type: "Networking",
      description: "End-of-year gala to celebrate achievements and network with industry leaders.",
      budget: 150000,
      sponsors: ["LuxeBrands", "GourmetFoods", "EventPro"],
      speakers: ["George Clooney", "Amal Clooney"],
    },
    {
      id: 5,
      name: "Startup Pitch Night",
      date: "2024-01-20",
      location: "Berlin, Germany",
      organizer: "Soylent Corp",
      attendees: 200,
      status: "Planning",
      type: "Networking",
      description: "An evening for startups to pitch their ideas to potential investors.",
      budget: 50000,
      sponsors: ["VentureCapital", "StartupIncubator", "TechFund"],
      speakers: ["Elon Musk", "Mark Zuckerberg"],
    },
  ])

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    organizer: "",
    attendees: "",
    status: "Planning",
    type: "",
    description: "",
    budget: "",
    sponsors: [],
    speakers: [],
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent>({
    id: 0,
    name: "",
    date: "",
    location: "",
    organizer: "",
    attendees: 0,
    status: "",
    type: "",
    description: "",
    budget: 0,
    sponsors: [],
    speakers: [],
  })
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    let result = events.filter((event) =>
      Object.values(event).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
    )

    if (filterStatus !== "all") {
      result = result.filter((event) => event.status === filterStatus)
    }

    if (filterType !== "all") {
      result = result.filter((event) => event.type === filterType)
    }

    result.sort((a:any, b:any) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredEvents(result)
  }, [searchQuery, events, filterStatus, filterType, sortBy, sortOrder])

  const handleAddEvent = () => {
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      attendees: Number.parseInt(newEvent.attendees),
      budget: Number.parseFloat(newEvent.budget),
    }
    setEvents([...events, eventToAdd])
    setIsAddEventModalOpen(false)
    setNewEvent({
      name: "",
      date: "",
      location: "",
      organizer: "",
      attendees: "",
      status: "Planning",
      type: "",
      description: "",
      budget: "",
      sponsors: [],
      speakers: [],
    })
    toast.success(
      "Event Added",{
      description: "The new event has been successfully added.",
    })
  }

  const getStatusBadge = (status :any) => {
    switch (status) {
      case "Upcoming":
        return <Badge className="bg-blue-500/20 text-blue-500">Upcoming</Badge>
      case "Planning":
        return <Badge className="bg-yellow-500/20 text-yellow-500">Planning</Badge>
      case "Completed":
        return <Badge className="bg-green-500/20 text-green-500">Completed</Badge>
      default:
        return null
    }
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
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
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
                <DropdownMenuItem onClick={() => setSortBy("attendees")}>Attendees</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddEventModalOpen} onOpenChange={setIsAddEventModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#00B14F] text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2A2A2A] text-white">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Enter the details of the new event here.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Event Name
                    </Label>
                    <Input
                      id="name"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
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
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organizer" className="text-right">
                      Organizer
                    </Label>
                    <Input
                      id="organizer"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="attendees" className="text-right">
                      Expected Attendees
                    </Label>
                    <Input
                      id="attendees"
                      type="number"
                      value={newEvent.attendees}
                      onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Event Type
                    </Label>
                    <Select onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select onValueChange={(value) => setNewEvent({ ...newEvent, status: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="budget" className="text-right">
                      Budget
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newEvent.budget}
                      onChange={(e) => setNewEvent({ ...newEvent, budget: e.target.value })}
                      className="col-span-3 bg-[#1E1E1E]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddEvent} className="bg-[#00B14F] text-white">
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[#333333] hover:bg-[#2A2A2A]">
              <TableHead className="text-white">Event Name</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Location</TableHead>
              <TableHead className="text-white">Organizer</TableHead>
              <TableHead className="text-white">Attendees</TableHead>
              <TableHead className="text-white">Type</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id} className="border-[#333333] hover:bg-[#2A2A2A]">
                <TableCell className="font-medium text-white">{event.name}</TableCell>
                <TableCell className="text-white">{event.date}</TableCell>
                <TableCell className="text-white">{event.location}</TableCell>
                <TableCell className="text-white">{event.organizer}</TableCell>
                <TableCell className="text-white">{event.attendees}</TableCell>
                <TableCell className="text-white">{event.type}</TableCell>
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
                      <DropdownMenuItem>Manage attendees</DropdownMenuItem>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Event Name</Label>
                    <div>{selectedEvent.name}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Date</Label>
                    <div>{selectedEvent.date}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Location</Label>
                    <div>{selectedEvent.location}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Organizer</Label>
                    <div>{selectedEvent.organizer}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Type</Label>
                    <div>{selectedEvent.type}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Status</Label>
                    <div>{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label className="text-right">Description</Label>
                    <div>{selectedEvent.description}</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="attendees">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Attendee Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#1E1E1E]">
                      <CardHeader>
                        <CardTitle>Total Attendees</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">{selectedEvent.attendees}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1E1E1E]">
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
              </TabsContent>
              <TabsContent value="budget">
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-2">Budget Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#1E1E1E]">
                      <CardHeader>
                        <CardTitle>Total Budget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold">${selectedEvent.budget.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1E1E1E]">
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
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEventModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}




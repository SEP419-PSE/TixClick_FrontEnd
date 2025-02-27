import { MoreHorizontal, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { ManagerHeader } from "../ManagerHeader"




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
    },
    {
      id: 2,
      name: "Marketing Summit",
      date: "2023-10-01",
      location: "New York, NY",
      organizer: "Globex Corporation",
      attendees: 300,
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Product Launch",
      date: "2023-11-10",
      location: "London, UK",
      organizer: "Initech",
      attendees: 1000,
      status: "Planning",
    },
    {
      id: 4,
      name: "Annual Gala",
      date: "2023-12-05",
      location: "Paris, France",
      organizer: "Umbrella Corporation",
      attendees: 750,
      status: "Planning",
    },
    {
      id: 5,
      name: "Startup Pitch Night",
      date: "2024-01-20",
      location: "Berlin, Germany",
      organizer: "Soylent Corp",
      attendees: 200,
      status: "Planning",
    },
  ])

  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    organizer: "",
    attendees: "",
    status: "Planning",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)

  useEffect(() => {
    const filtered = events.filter((event) =>
      Object.values(event).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
    )
    setFilteredEvents(filtered)
  }, [searchQuery, events])

  const handleAddEvent = () => {
    setEvents([...events, { ...newEvent, id: events.length + 1, attendees: Number.parseInt(newEvent.attendees) }])
    setNewEvent({ name: "", date: "", location: "", organizer: "", attendees: "", status: "Planning" })
  }

  return (
    <>
      <ManagerHeader heading="Events" text="Manage and view all events" />
      <main className="flex-1 overflow-y-auto bg-[#1E1E1E] p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              className="w-[300px] bg-[#2A2A2A] text-white"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] bg-[#2A2A2A] text-white">
                <SelectValue placeholder="Filter by organizer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizers</SelectItem>
                <SelectItem value="acme">Acme Inc</SelectItem>
                <SelectItem value="globex">Globex Corporation</SelectItem>
                <SelectItem value="initech">Initech</SelectItem>
                <SelectItem value="umbrella">Umbrella Corporation</SelectItem>
                <SelectItem value="soylent">Soylent Corp</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
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
                    <Select onValueChange={(value) => setNewEvent({ ...newEvent, organizer: value })}>
                      <SelectTrigger className="col-span-3 bg-[#1E1E1E]">
                        <SelectValue placeholder="Select organizer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acme Inc">Acme Inc</SelectItem>
                        <SelectItem value="Globex Corporation">Globex Corporation</SelectItem>
                        <SelectItem value="Initech">Initech</SelectItem>
                        <SelectItem value="Umbrella Corporation">Umbrella Corporation</SelectItem>
                        <SelectItem value="Soylent Corp">Soylent Corp</SelectItem>
                      </SelectContent>
                    </Select>
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
              <TableHead className="text-white">Expected Attendees</TableHead>
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
                <TableCell className="text-white">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.status === "Upcoming"
                        ? "bg-blue-500/20 text-blue-500"
                        : event.status === "Planning"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-green-500/20 text-green-500"
                    }`}
                  >
                    {event.status}
                  </span>
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
                      <DropdownMenuItem>View event details</DropdownMenuItem>
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
    </>
  )
}


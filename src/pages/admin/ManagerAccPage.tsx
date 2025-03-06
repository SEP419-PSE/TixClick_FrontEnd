import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

const mockAccounts = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Manager" },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [editingAccount, setEditingAccount] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

  

  const filteredAccounts = accounts.filter(
    (account) =>
      (account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || account.role === filterRole),
  )

  const handleAddAccount = (newAccount:any) => {
    setAccounts([...accounts, { id: accounts.length + 1, ...newAccount, role: "Manager" }])
    toast.success(
      "Account Created",{
      description: "New manager account has been successfully created.",
    })
  }

  const handleEditAccount = (updatedAccount:any) => {
    setAccounts(
      accounts.map((account) => (account.id === updatedAccount.id ? { ...account, ...updatedAccount } : account)),
    )
    setEditingAccount(null)
    toast.success(
      "Account Updated",{
      description: "The account has been successfully updated.",
    })
  }

  const handleDeleteAccount = (id:any) => {
    setAccounts(accounts.filter((account) => account.id !== id))
    toast.success(
      "Account Deleted",{
      description: "The account has been successfully deleted."
    })
  }

  return (
    <div className="p-6 bg-[#1E1E1E] text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Account Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#00B14F] hover:bg-[#00963F]">
              <Plus className="mr-2 h-4 w-4" /> Add New Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
            <DialogHeader>
              <DialogTitle>Add New Manager Account</DialogTitle>
              <DialogDescription>Create a new account for a manager. Fill in the details below.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const newAccount = Object.fromEntries(formData)
                handleAddAccount(newAccount)
              }}
            >
              <div className="grid gap-4 py-4 text-white">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#00B14F] hover:bg-[#00963F]">
                  Add Manager
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A] mb-6 text-white">
        <CardHeader>
          <CardTitle className="text-white">Account Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Total Accounts</span>
            <span className="text-2xl font-bold">{accounts.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Admins</span>
            <span className="text-2xl font-bold">{accounts.filter((a) => a.role === "Admin").length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Managers</span>
            <span className="text-2xl font-bold">{accounts.filter((a) => a.role === "Manager").length}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#3A3A3A] border-[#4A4A4A] text-white"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px] bg-[#3A3A3A] border-[#4A4A4A] text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-white">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-white">
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        account.role === "Admin" ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {account.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>

                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => setEditingAccount(account)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#2A2A2A] text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the account and remove the
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-600 text-white hover:bg-gray-700">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
        <DialogContent className="sm:max-w-[425px] bg-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Make changes to the account here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const updatedAccount = Object.fromEntries(formData)
                handleEditAccount({ ...editingAccount, ...updatedAccount })
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingAccount.name}
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingAccount.email}
                    className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white"
                  />
                </div>
                {editingAccount.role === "Manager" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Role
                    </Label>
                    <Select name="role" defaultValue={editingAccount.role}>
                      <SelectTrigger className="col-span-3 bg-[#3A3A3A] border-[#4A4A4A] text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#00B14F] hover:bg-[#00963F]">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


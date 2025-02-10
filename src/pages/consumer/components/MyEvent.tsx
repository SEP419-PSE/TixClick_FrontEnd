import { Search } from "lucide-react"



export default function MyEventsPage() {

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
         
        </div>
      </div>
    </div>
  )
}


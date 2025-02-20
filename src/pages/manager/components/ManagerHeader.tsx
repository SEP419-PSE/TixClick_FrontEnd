import { ChevronDownIcon, FileText, LogOut, ShoppingBag, User } from "lucide-react";


export function ManagerHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#1a1a1a]">
      <h1 className="text-2xl font-semibold text-white">Manager Dashboard</h1>
      <div className="relative group">
        <button className="flex items-center gap-2 text-white">
          <User className="w-5 h-5" />
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <div className="py-1">
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
              <ShoppingBag className="w-4 h-4" />
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
              <FileText className="w-4 h-4" />
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
              <User className="w-4 h-4" />
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
              <LogOut className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
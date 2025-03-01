

export default function NavItem({ icon: Icon, label, active = false }: any) {
  return (
    <a
      href="href"
      className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium ${
        active ? "bg-[#00B14F] text-white" : "text-gray-300 hover:bg-[#3A3A3A]"
      }`}
    >
      
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  )
}
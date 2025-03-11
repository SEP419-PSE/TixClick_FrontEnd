import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  query: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  query,
  onChange,
  onSearch,
}) => {
  return (
    <div className="flex items-center space-x-2 bg-[#F5F5F5] rounded-xl p-2 w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-none outline-none bg-[#F5F5F5] text-pse-gray focus:ring-0 p-2"
      />
      <button onClick={onSearch} className=" p-2 rounded">
        <Search size={24} />
      </button>
    </div>
  );
};

export default SearchBar;

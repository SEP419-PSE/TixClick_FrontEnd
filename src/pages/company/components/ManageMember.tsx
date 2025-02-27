import { useState } from "react";
import CompanyAccount from "./CompanyAccount";
import SearchBar from "./SearchBar";

const ManageMember = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query);
  };
  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center font-semibold">
        <SearchBar
          placeholder="Search something..."
          query={query}
          onChange={setQuery}
          onSearch={handleSearch}
        />
        <CompanyAccount />
      </div>
      <div className="w-full h-[1px] mt-3 mb-3 bg-[#dbdbdb]"></div>
      <div className="text-[46px] font-semibold">
        <p>Members</p>
      </div>
    </div>
  );
};

export default ManageMember;

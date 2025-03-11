import { useState } from "react";
import CompanyAccount from "./CompanyAccount";
import SearchBar from "./SearchBar";
import EmptyList from "../../../components/EmptyList/EmptyList";
import { Button } from "../../../components/ui/button";

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
      <div className="flex justify-between items-center text-[46px] font-semibold">
        <p>Members</p>
        <Button>Thêm thành viên</Button>
      </div>
      <div>
        <EmptyList label="Không có thành viên nào" />
      </div>
    </div>
  );
};

export default ManageMember;

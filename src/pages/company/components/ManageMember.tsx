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
    <div className="px-6 py-6 bg-transparent text-white overflow-y-hidden">
      <div className="flex justify-between items-center text-[30px] font-semibold">
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

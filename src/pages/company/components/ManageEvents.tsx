import { useState } from "react";
import CompanyAccount from "./CompanyAccount";
import SearchBar from "./SearchBar";
import EmptyList from "../../../components/EmptyList/EmptyList";
import { Button } from "../../../components/ui/button";
import { NavLink, useNavigate } from "react-router";

const ManageEvents = () => {
  const navigate = useNavigate();
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
        <p>Events</p>
        <Button onClick={() => navigate("/create-event")}>Tạo sự kiện</Button>
      </div>
      <EmptyList label="Không có sự kiện nào" />
    </div>
  );
};

export default ManageEvents;

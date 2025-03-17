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
    <div className="px-6 py-6 bg-transparent text-white overflow-y-hidden">
      <div className="flex justify-between items-center text-[30px] font-semibold">
        <p>Events</p>
        <Button onClick={() => navigate("/create-event")}>Tạo sự kiện</Button>
      </div>
      <EmptyList label="Không có sự kiện nào" />
    </div>
  );
};

export default ManageEvents;

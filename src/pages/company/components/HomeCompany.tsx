import { useState } from "react";
import SearchBar from "./SearchBar";
import CompanyAccount from "./CompanyAccount";
import Statistic from "./Statistic";
import MemberList from "./member/MemberList";

const HomeCompany = () => {
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
      <div className="w-full h-[1px] mt-3 mb-8 bg-[#dbdbdb]"></div>
      <div className="flex items-center justify-between">
        <Statistic
          label="Tổng sự kiện"
          quantity={10}
          subLabel="Sự kiện"
          percent={22}
        />
        <Statistic
          label="Tổng vé bán ra"
          quantity={4000}
          subLabel="Vé bán"
          percent={22}
        />
        <Statistic
          label="Tổng nhân sự"
          quantity={6}
          subLabel="Nhân sự"
          percent={22}
        />
        <Statistic
          label="Tổng hợp đồng"
          quantity={1}
          subLabel="Hợp đồng"
          percent={22}
        />
      </div>
      <div className="my-8">
        <div className="w-[800px]">
          <MemberList />
        </div>
      </div>
    </div>
  );
};

export default HomeCompany;

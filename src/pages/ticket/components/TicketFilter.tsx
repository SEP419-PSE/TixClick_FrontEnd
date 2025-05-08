import React from "react";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { SortType } from "../../../interface/ticket/Ticket";

type TicketFilterProps = {
  sort: SortType;
  setSort: (e: string) => void;
};

const TicketFilter: React.FC<TicketFilterProps> = ({ sort, setSort }) => {
  return (
    <div>
      <Select value={sort} onValueChange={(e: string) => setSort(e)}>
        <SelectTrigger className="w-[200px] text-black">
          <SelectValue placeholder="Sắp xếp theo ngày" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ASC">Mới nhất</SelectItem>
          <SelectItem value="DESC">Lâu nhất</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TicketFilter;

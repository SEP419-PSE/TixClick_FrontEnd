import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
const FilterCheckIn = () => {
  return (
    <div className="flex items-center">
      <div className="text-2xl font-semibold">
        Checkin:{" "}
        <span className="font-semibold text-pse-gray">Hoạt động 1</span>
      </div>
      <Select>
        <SelectTrigger className="w-[180px] ml-auto">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Hoạt động 1</SelectItem>
          <SelectItem value="dark">Hoạt động 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterCheckIn;

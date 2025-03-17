import EmptyList from "../../../components/EmptyList/EmptyList";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router";

const ManageEvents = () => {
  const navigate = useNavigate();

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

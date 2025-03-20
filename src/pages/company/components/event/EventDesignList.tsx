import FilterEvent from "./FilterEvent";
import SearchEvent from "./SearchEvent";

const EventDesignList = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <SearchEvent />
      <div className="lg:ml-auto">
        <FilterEvent />
      </div>
    </div>
  );
};

export default EventDesignList;

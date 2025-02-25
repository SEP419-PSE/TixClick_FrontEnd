import EventActivityList from "./EventActivityList";

const StepTwo = () => {
  return (
    <div className="text-[16px]">
      <section className="flex justify-between">
        <p className="">Thời Gian</p>
        <select className="text-pse-black px-2">
          <option>Tất cả</option>
        </select>
      </section>
      <EventActivityList />
      <div className="h-[1px] rounded-full my-3 w-full bg-white"></div>
    </div>
  );
};

export default StepTwo;

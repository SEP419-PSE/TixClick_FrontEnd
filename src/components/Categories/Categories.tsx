import { eventTypes } from "../../constants/constants";

const Categories = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 px-4 lg:px-14 py-4 bg-transparent overflow-x-auto">
      {eventTypes.map((type) => (
        <div className="relative w-[340px] rounded-md shadow-md">
          <div className="overflow-hidden w-full rounded-md">
            <img
              src={type.img}
              alt={type.name}
              className="transition-transform duration-300 ease-in-out transform hover:scale-110 object-cover w-full"
            />
          </div>
          <div
            style={{ backgroundColor: type.color }}
            className={`absolute bottom-0 left-0 w-full p-2 rounded-b-md text-center`}
          >
            <p className="font-semibold text-sm md:text-base">
              {type.vietnamName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;

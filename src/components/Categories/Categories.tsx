import { eventTypes } from "../../constants/constants";

interface CategoriesProps {
  onCategoryClick: (categoryId: number) => void;
}

const Categories = ({ onCategoryClick }: CategoriesProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 px-4 lg:px-14 py-4 bg-transparent overflow-x-auto">
      {eventTypes.map((type) => {
        const Icon = type.icon; // Lấy component icon
        return (
          <div
            key={type.id}
            className="relative w-[340px] rounded-md shadow-md cursor-pointer"
            onClick={() => onCategoryClick(type.id)}
          >
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
              <p className="font-semibold flex items-center text-sm md:text-base">
                <Icon className="h-5 w-5 mr-2 text-white" />
                {type.vietnamName}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;

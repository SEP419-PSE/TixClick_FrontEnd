import { LuSearch } from "react-icons/lu";

const SearchBar = () => {
  return (
    <div className="hidden lg:flex items-center">
      <span className="bg-white pl-4 py-2 rounded-tl-lg rounded-bl-lg">
        <LuSearch size={21} color="black" />
      </span>
      <input
        placeholder="Bạn tìm gì?"
        className="px-4 py-2 text-black outline-none"
      />
      <button className="bg-white pr-4 py-2 text-black rounded-tr-lg rounded-br-lg">
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;

const Categories = () => {
  return (
    <div className="px-4 lg:px-14 py-2 bg-black overflow-x-auto">
      <div className="px-4 whitespace-nowrap">
        <ul className="flex items-center gap-4 ">
          <li className="lg:hover:text-pse-green cursor-pointer transition-all duration-300">
            Nhạc sống
          </li>
          <li className="lg:hover:text-pse-green cursor-pointer transition-all duration-300">
            Sân khấu & Nghệ thuật
          </li>
          <li className="lg:hover:text-pse-green cursor-pointer transition-all duration-300">
            Thể thao
          </li>
          <li className="lg:hover:text-pse-green cursor-pointer transition-all duration-300">
            Khác
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Categories;

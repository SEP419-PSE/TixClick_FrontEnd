const HeroSlider = () => {
  return (
    <div className="mx-4 my-8">
      <div className="relative w-full lg:w-[30%] h-60 overflow-hidden rounded-lg">
        <img
          src="https://images.tkbcdn.com/2/614/350/ts/ds/f0/ca/7c/1c7973947f9b163b2376dc6bdc0c6540.jpg"
          alt="Thumbnail"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
        />
      </div>
    </div>
  );
};

export default HeroSlider;

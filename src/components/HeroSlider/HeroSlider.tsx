const HeroSlider = () => {
  return (
    <div className="lg:mb-8">
      <div className="relative">
        {/* <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2b/cf/04/28f7e94ace8d993b981003b88b26b0b5.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/2a/83/ac/cb6963360dae30f95f517cefc982780e.jpg" />
        <img src="https://images.tkbcdn.com/2/614/350/ts/ds/8a/02/c3/c9d60e7974b86bb46ff88e96ae91b3cc.jpg" /> */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-[100%] h-screen object-cover brightness-70"
        >
          <source
            src="https://videos.pexels.com/video-files/4043988/4043988-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <button className="absolute text-xl md:text-2xl hover:text-pse-green z-10 px-4 py-2 bg-transparent hover:bg-pse-black rounded-lg transition-all duration-300 border border-white top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;

const LoadingFullScreen = () => {
  return (
    <div className="fixed w-full h-full top-[50%] left-[50%] flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce"></div>
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-pse-green animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default LoadingFullScreen;

import CustomDivider from "../Divider/CustomDivider";

const HostEvent = () => {
  return (
    <div className="bg-white/80 p-3 pb-8 text-pse-black">
      <div className="w-full max-w-[700px] bg-white p-3 rounded-lg mx-auto">
        <p className="font-bold">Ban Tổ Chức</p>
        <CustomDivider />
        <div className="flex flex-col lg:flex-row">
          <div className="w-[160px] h-[160px]">
            <img src="https://salt.tkbcdn.com/ts/ds/c0/19/1e/ee5eea71c3adb464bc9481ff9f7bb161.png" />
          </div>
          <div>
            <p className="font-extrabold text-[20px]">Ime</p>
            <p>
              We are concert promoter, artist management and event organizer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostEvent;

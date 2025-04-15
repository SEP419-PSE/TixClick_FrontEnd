import { OrderList } from "./OrderList";

const Order = () => {
  return (
    <div className="p-6 bg-white w-auto h-screen">
      <p className="font-bold text-foreground text-3xl"></p>
      <OrderList />
    </div>
  );
};

export default Order;

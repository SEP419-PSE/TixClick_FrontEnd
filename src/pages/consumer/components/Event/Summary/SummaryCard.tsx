import { Card, CardContent } from "../../../../../components/ui/card";
import { formatMoney } from "../../../../../lib/utils";
import { Summary } from "./SummaryRevenue";

const SummaryCard = ({ growth, name, value, icon, type }: Summary) => {
  return (
    <Card className="flex flex-col bg-background text-foreground shadow-md rounded-2xl border max-w-sm">
      <div className="font-semibold px-6 pt-6 mb-4">
        <div className="flex justify-between items-center text-lg">
          {name}
          <span>{icon}</span>
        </div>
      </div>
      <CardContent className="font-bold text-2xl">
        {type == "REVENUE" ? formatMoney(value) : value}
        <div className="text-pse-gray text-xs mt-1">
          +{growth}% so với tuần trước
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

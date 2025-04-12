import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TimeInputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string; // Thêm className vào đây để dễ tùy chỉnh style
};

const TimeInput = ({
  label,
  id,
  value,
  onChange,
  className,
}: TimeInputProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-input bg-background text-white shadow-sm ${className}`} // Thêm className vào đây
    />
  </div>
);

export default TimeInput;

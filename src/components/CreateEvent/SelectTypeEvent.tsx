import { EventType } from "../../interface/EventInterface";

type Props = {
  label: string;
  listType: EventType[];
  choice: string;
  setChoice: React.Dispatch<React.SetStateAction<string>>;
  selectedId: number | null;
};

const SelectTypeEvent = ({
  label,
  listType,
  choice,
  setChoice,
  selectedId,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChoice(e.target.value);
  };
  return (
    <div className="flex flex-col items-start gap-1 p-2">
      <label htmlFor="selects" className="text-white">
        {label}
      </label>
      <select
        value={choice}
        onChange={handleChange}
        name="selects"
        id="selects"
        className="px-2 py-2 outline-none text-[14px] w-full rounded-md"
      >
        <option value="" disabled selected>
          Vui lòng chọn
        </option>
        {listType.map((type, index) => (
          <option
            className={`hover:bg-gray-200 ${
              selectedId === type.id && "font-semibold text-white bg-pse-green"
            }`}
            key={index}
            value={type.id}
          >
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTypeEvent;

import { useState } from "react";

interface TextInputProps {
  maxLength: number;
  label: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

export default function TextInput({
  maxLength,
  label,
  text,
  setText,
}: TextInputProps) {
  const [nullError, setNullError] = useState<boolean>(false);
  const [isMaxLength, setIsMaxLength] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setNullError(true);
    } else {
      setNullError(false);
    }
    if (event.target.value.length > 100) {
      setIsMaxLength(true);
    } else {
      setIsMaxLength(false);
    }
    // Chỉ cập nhật nếu chiều dài không vượt quá maxLength
    setText(event.target.value);
  };

  return (
    <div className="flex flex-col w-full items-start rounded-lg p-2 gap-1">
      <label className="text-white">{label}</label>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={label}
        className="px-2 py-1 outline-none text-[14px] w-full rounded-md"
        maxLength={maxLength} // Thêm thuộc tính maxLength trực tiếp vào input
      />
      <div className="flex justify-between w-full text-sm text-white/80 mt-1">
        {nullError ? (
          <p className="text-pse-error">Vui lòng điền thông tin</p>
        ) : (
          <p></p>
        )}
        <p className={`${isMaxLength ? "text-pse-error" : "text-white/80"}`}>
          {text.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}

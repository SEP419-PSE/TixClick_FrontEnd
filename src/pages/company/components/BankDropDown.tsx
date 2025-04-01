import React from "react";

type Bank = {
  id: string;
  bankName: string;
};

type Props = {
  banks: Bank[];
  selectedBankName: string;
  onChange: (bankName: string) => void;
};

const BankDropdown: React.FC<Props> = ({
  banks,
  selectedBankName,
  onChange,
}) => {
  return (
    <div className="w-full mb-4 px-1">
      <label className="block mb-1 font-medium text-white">
        Chọn ngân hàng
      </label>
      <select
        className="w-full p-1 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-pse-gray"
        value={selectedBankName}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Chọn ngân hàng --</option>
        {banks.map((bank) => (
          <option key={bank.id} value={bank.bankName}>
            {bank.bankName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BankDropdown;

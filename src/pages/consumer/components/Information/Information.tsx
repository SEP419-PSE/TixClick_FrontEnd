import { useEffect, useState } from "react";
import { Company } from "../../../../interface/company/Company";
import companyApi from "../../../../services/companyApi";
import BankCard from "../../../company/components/BankCard";
import clsx from "clsx";
import { MapPin, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import LoadingFullScreen from "../../../../components/Loading/LoadingFullScreen";

const Information = () => {
  const [company, setCompany] = useState<Company>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInfor = async () => {
    setIsLoading(true);
    const response = await companyApi.isAccountHaveCompany();
    if (response.data.result) {
      setCompany(response.data.result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInfor();
  }, []);

  if (!company) {
    return <LoadingFullScreen />;
  }

  return (
    <div className="w-full bg-gradient-to-b from-pse-green min-h-[calc(100vh-70px)] flex justify-center items-center">
      {isLoading ? (
        <LoadingFullScreen />
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-auto max-w-2xl bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col gap-4"
        >
          {/* Logo & tên công ty */}
          <div className="flex items-center gap-4">
            <img
              src={company.logoURL}
              alt="Logo công ty"
              className="w-20 h-20 rounded-md object-cover border border-gray-300"
            />
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-800">
                {company.companyName}
              </h2>
              <p
                className={`flex items-center gap-1 text-sm font-medium ${clsx({
                  "text-green-600": company.status == "ACTIVE",
                  "text-red-500": company.status == "REJECTED",
                  "text-pse-green": company.status == "PENDING",
                })}
              }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${clsx({
                    "bg-green-600": company.status == "ACTIVE",
                    "bg-red-500": company.status == "REJECTED",
                    "bg-pse-green": company.status == "PENDING",
                  })}`}
                ></div>
                {company.status}
              </p>
              <div className="flex items-start gap-1 text-black">
                <MapPin size={14} />
                <span>{company.address}</span>
              </div>
            </div>
            <button className="text-black hover:text-pse-green p-2 rounded-full bg-pse-black/20 ml-auto mb-auto">
              <Pencil size={18} />
            </button>
          </div>

          {/* Mô tả */}
          <p className="text-gray-700 text-sm italic">
            "{company.description}"
          </p>

          {/* Thông tin chi tiết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold">Mã số thuế:</p>
              <p>{company.codeTax}</p>
            </div>
            <div>
              <p className="font-semibold">Số CCCD/CMND:</p>
              <p>{company.nationalId}</p>
            </div>
          </div>
          <BankCard
            accountNumber={company.bankingCode}
            bankName={company.bankingName}
            ownerCard={company.ownerCard}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Information;

import { useEffect, useState } from "react";
import { Company } from "../interface/company/Company";
import companyApi from "../services/companyApi";

const useAllCompany = () => {
  const [companies, setCompanies] = useState<Company>();

  const fetchCompanies = async () => {
    try {
      const response = await companyApi.isAccountHaveCompany();
      if (response.data.code == 200) {
        setCompanies(response.data.result);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
  return companies;
};

export default useAllCompany;

export interface customAccount {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
}

export interface Company {
  companyId: number;
  companyName: string;
  codeTax: string;
  bankingName: string;
  bankingCode: string;
  nationalId: string;
  logoURL: string;
  description: string;
  address: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  companyVerificationId: number;
  customAccount: customAccount;
}



export interface Document {
  contract_id: number
  file_name: string
  file_type: string
  uploaded_date: string
  file_url?: string
  company_id: number
}

export interface Company {
  companyId: number;
  companyName: string;
  codeTax: string;
  bankingName: string;
  bankingCode: string;
  ownerCard: string;
  nationalId: string;
  logoURL: string;
  address: string;
  description: string;
  status: string;
  representativeId: number;
}

export type CompanyStatus = "ACTIVE" | "PENDING" | "REJECTED";

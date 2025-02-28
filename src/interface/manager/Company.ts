export interface Company {
    companyId: number;
    companyName: string;
    codeTax: string;
    bankingName: string;
    bankingCode: string;
    nationalId: string;
    logoURL: string;
    description: string;
    status: "PENDING" | "ACTIVE" | "INACTIVE"; 
    representativeId: number;
  }
  
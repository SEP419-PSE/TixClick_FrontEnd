export interface Account {
  accountId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string | null;
  active: boolean;
  avatarURL: string | null;
  dob: string | null;
  roleId: number;
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
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  representativeId: number;
  accountDTO: Account;
}

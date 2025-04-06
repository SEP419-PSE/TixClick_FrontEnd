export interface CreateMemberRequest {
  companyId: number;
  mailList: MailList[];
}

export interface MailList {
  mail: string;
  subRole: SubRole;
}

export type SubRole = "ADMIN" | "EMPLOYEE";

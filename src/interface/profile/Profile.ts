export interface Profile {
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
  
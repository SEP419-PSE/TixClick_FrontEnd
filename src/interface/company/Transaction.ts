export interface TransactionResponse {
  transactionCode: string;
  accountName: string;
  accountMail: string;
  transactionType: string;
  amount: number;
  transactionDate: Date;
  status: string;
}

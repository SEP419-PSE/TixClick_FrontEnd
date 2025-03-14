export interface ManagerPayment {
    invoiceNumber: string;
    company: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    date: string;
    dueDate: string;
    status: string;
    paymentMethod: string;
    currency: string;
    paymentType: string;
    installments: Installment[];
}

export interface Installment {
    amount: number;
    dueDate: string;
    status: string;
}

export interface Payments {
    paymentId: number;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  status: string;
  orderCode: string;
  orderId: number;
  accountId: number;
}
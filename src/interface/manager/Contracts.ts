// export interface Contracts{
//     id: number; 
//     name: string; 
//     company: string; 
//     type: string; 
//     startDate: string; 
//     endDate: string; 
//     value: number; 
//     status: string; 
//     progress: number; 
//     documents: string[]; 
// }

// export interface Contracts {
//     contractId: number;
//     totalAmount: number;
//     commission: string;
//     contractType: string;
//     accountId: number;
//     eventId: number;
//     companyId: number;
//   }

export interface ContractDocumentDTO {
    contractDocumentId: number;
    contractId: number;
    fileName: string;
    fileURL: string;
    fileType: string;
    uploadedBy: number;
    status: "PENDING" | "APPROVED" | "REJECTED"; // Đảm bảo các giá trị status hợp lệ
    uploadDate: string | null;
  }
  
  export interface ContractDTO {
    contractId?: number;
    contractName: string;
    totalAmount: number;
    commission: string;
    contractType: string;
    startDate: string;
    endDate: string;
    status: "PENDING" | "ACTIVE" | "CANCELLED"; // Các giá trị status hợp lệ
    accountId: number;
    eventId: number;
    companyId: number;
  }
  
export interface ContractWithDocuments {
    contractDTO: ContractDTO;
    contractDocumentDTOS: ContractDocumentDTO[];
  }
  

export interface ContractUpload {
    contractId: number;
    file: string
}

// export interface ContractDocumentResponse {
//     contractDocumentId: number;
//     contractId: number;
//     fileName: string;
//     fileURL: string;
//     fileType: string;
//     uploadedBy: number;
//     uploadDate: string; 
//   }
  

export interface VietQR {
    bankID: string,
    accountID: string,
    amount: string,
    description: string,
}
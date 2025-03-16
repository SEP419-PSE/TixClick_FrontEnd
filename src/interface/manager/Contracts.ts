export interface Contracts{
    id: number; 
    name: string; 
    company: string; 
    type: string; 
    startDate: string; 
    endDate: string; 
    value: number; 
    status: string; 
    progress: number; 
    documents: string[]; 
}

// export interface Contracts {
//     contractId: number;
//     totalAmount: number;
//     commission: string;
//     contractType: string;
//     accountId: number;
//     eventId: number;
//     companyId: number;
//   }

export interface ContractUpload {
    contractId: number;
    file: string
}

export interface ContractDocumentResponse {
    contractDocumentId: number;
    contractId: number;
    fileName: string;
    fileURL: string;
    fileType: string;
    uploadedBy: number;
    uploadDate: string; 
  }
  
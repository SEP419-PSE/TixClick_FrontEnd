export interface ContractDTO {
  contractId: number
  contractName: string
  totalAmount: number
  commission: string
  contractType: string
  startDate: string | null
  endDate: string | null
  status: string | null
  accountId: number
  eventId: number
  companyId: number
}

export interface ContractDocumentDTO {
  contractDocumentId: number
  contractId: number
  fileName: string
  fileURL: string
  fileType: string
  uploadedBy: number
  status: string
  uploadDate: string | null
}

export interface ContractResponse {
  contractDTO: ContractDTO
  contractDocumentDTOS: ContractDocumentDTO[]
}

export interface VietQR {
  bankID: string
  accountID: string
  amount: string
  description: string
}

export interface ContractUpload {
  contractId: number;
  file: string
}
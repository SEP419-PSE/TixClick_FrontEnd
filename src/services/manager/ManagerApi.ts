// import { ContractUpload } from "../../interface/manager/Contracts";
import { Contract } from "../../interface/manager/Contracts";
import axiosClient from "../axiosClient";

const managerApi = {
  getAllCompany() {
    const url = "/company/manager";
    const token = localStorage.getItem("accessToken2");
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAllContract() {
    const url = "/contract/all";
    const token = localStorage.getItem("accessToken2");

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAllPayment() {
    const url = "/payment/all";
    return axiosClient.get(url);
  },

  getAllEvent() {
    const url = "/event/all_scheduled_pending_approved";
    return axiosClient.get(url);
  },
  // approveCompany(status:string, companyVerificationId:number){
  // const url = `/company-verification/${companyVerificationId}/approve?status=${status}`
  //     return axiosClient.patch(url, {header});
  // }

  getContractsByEventId(eventId: number) {
    const url = `/contract-document/all_by_event/${eventId}`;
    const token = localStorage.getItem("accessToken2");

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
  },

  approveCompany(status: string, companyVerificationId: number) {
    const url = `/company-verification/${companyVerificationId}/approve`;

    const token = localStorage.getItem("accessToken2");

    return axiosClient.patch(url, {
      params: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000,
    });
  },

  approveEvent(status: string, eventId: number) {
    const url = `/event/approve/${eventId}/${status}`;

    const token = localStorage.getItem("accessToken2");

    return axiosClient.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
        timeout: 10000,
      }
    );
  },

  // uploadContractDocument(request: ContractUpload){
  //     const url = `/contract-document/upload?contractId=${request.contractId}`;
  //     return axiosClient.post(url, request);
  // }

  uploadContractDocument(contractId: number, file: File) {
    const url = `/contract-document/upload?contractId=${contractId}`;

    const formData = new FormData();
    formData.append("file", file);

    return axiosClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

    // uploadContractManager(file: File){
    //     const url = "/contract/createContractAndContractDetail";
    //     const token = localStorage.getItem("accessToken2")

    //     return axiosClient.post(url, file, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //           "Accept": "m"
    //         },
    //         timeout: 10000, 
    //     });
    // },

    uploadContractManager(file: File) {
      const url = "/contract/createContractAndContractDetail"
      const token = localStorage.getItem("accessToken2")
  
      // Create FormData and append the file with the exact key name "file"
      const formData = new FormData()
      formData.append("file", file)
  
      console.log("Uploading file:", file.name, file.size, file.type)
  
      return axiosClient.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf", 
          Accept: "*/*",
        },
        timeout: 30000,
        
      })
    },
    

  updateContract(request: Contract) {
    const url = "/contract/createContractAndContractDetail";
    return axiosClient.post(url, request);
  },

  // /contract-payment/pay?transactionCode=7876&paymentId=679
  payContractPayment(transactionCode: string, paymentId: number) {
    const url = `/contract-payment/pay?transactionCode=${transactionCode}&paymentId=${paymentId}`;
    return axiosClient.get(url);
  },

  getQrByContractId: (contractId: number | undefined) => {
    const url = `/contract-detail/qr/${contractId}`;
    return axiosClient.get(url);
  },
};

export default managerApi;

// import { ContractUpload } from "../../interface/manager/Contracts";
import { Contract } from "../../interface/manager/Contracts";
import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/manager";
        const token = localStorage.getItem("accessToken2");
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }   
        }
    );
       
    },

    getAllContract(){
        const url = "/contract/all";
        const token = localStorage.getItem("accessToken2");

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    getAllPayment(){
        const url = "/payment/all";
        return axiosClient.get(url);
    },

    getAllEvent(){
        const url = "/event/all_scheduled_pending_approved";
        return axiosClient.get(url)
    },
    // approveCompany(status:string, companyVerificationId:number){
    // const url = `/company-verification/${companyVerificationId}/approve?status=${status}`
    //     return axiosClient.patch(url, {header});
    // }

    getContractsByEventId(eventId: number) {
        const url = `/contract-document/all_by_event/{eventId}?eventId=${eventId}`;
        return axiosClient.get(url);
    },

    approveCompany(status: string, companyVerificationId: number) {
        const url = `/company-verification/${companyVerificationId}/approve`
    
        // Get token from localStorage
        const token = localStorage.getItem("accessToken2")
    
        // Return the axios request with proper headers configuration
        return axiosClient.patch(
          url,
          {}, // Empty body since data is in URL
          {
            params: { status }, // Add status as a query parameter
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000, // Add a timeout to prevent long-hanging requests
          },
        )
      },
    
    approveEvent(status: string, id: number) {
        const url = `/event/${id}/approve/${status}`;
        console.log("url:", url);
        console.log(status);
        console.log(id);
    
        const token = localStorage.getItem("accessToken");
    
        return axiosClient.put(
            url,
            {},  
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    },
    

    // uploadContractDocument(request: ContractUpload){
    //     const url = `/contract-document/upload?contractId=${request.contractId}`;
    //     return axiosClient.post(url, request);
    // }

    uploadContractDocument(contractId: number, file: File) {
        const url = `/contract-document/upload?contractId=${contractId}`
    
        const formData = new FormData()
        formData.append("file", file)
    
        return axiosClient.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      },

    updateContract(request: Contract){
        const url = "/contract/createContractAndContractDetail";
        return axiosClient.post(url, request);
    }
}

export default managerApi;
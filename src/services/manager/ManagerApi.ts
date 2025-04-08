// import { ContractUpload } from "../../interface/manager/Contracts";
import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/manager";
        const token = localStorage.getItem('accessToken2');
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    getAllContract(){
        const url = "/contract/all";
        return axiosClient.get(url);
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
        const url = `/company-verification/${companyVerificationId}/approve?status=${status}`;
        console.log("url:", url);
        console.log(status)
        console.log(companyVerificationId)
    

        const token = localStorage.getItem("accessToken2");
        return axiosClient.patch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    

    },
    
    approveEvent(status: string, id: number) {
        const url = `/event/${id}/approve/${status}`;
        console.log("url:", url);
        console.log(status);
        console.log(id);
    
        const token = localStorage.getItem("accessToken2");
    
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
}

export default managerApi;
import { ContractDocumentResponse } from "../../interface/manager/Contracts";
import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/manager";
        const token = localStorage.getItem('accessToken');
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
        const url = "/event/all";
        return axiosClient.get(url)
    },
    // approveCompany(status:string, companyVerificationId:number){
    // const url = `/company-verification/${companyVerificationId}/approve?status=${status}`
    //     return axiosClient.patch(url, {header});
    // }

    approveCompany(status: string, companyVerificationId: number) {
        const url = `/company-verification/${companyVerificationId}/approve?status=${status}`;
        console.log("url:", url);
        console.log(status)
        console.log(companyVerificationId)
    
    
        const token = localStorage.getItem('accessToken');
        return axiosClient.patch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    
        
    },
    

    uploadContractDocument(request: ContractDocumentResponse){
        const url = "/contract-document/upload";
        return axiosClient.post(url, request);
    }
}

export default managerApi;
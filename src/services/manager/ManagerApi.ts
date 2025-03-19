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
        const token = localStorage.getItem('accessToken');
        return axiosClient.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log("✅ Approved successfully:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("❌ Approval failed:", error.response?.data || error.message);
            throw error;
        });
    },

    uploadContractDocument(request: ContractDocumentResponse){
        const url = "/contract-document/upload";
        return axiosClient.post(url, request);
    }
}

export default managerApi;
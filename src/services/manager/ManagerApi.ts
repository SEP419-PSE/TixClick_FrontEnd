import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/manager";
        return axiosClient.get(url);
    },

    approveCompany(status:string, companyVerificationId:number){
    const url = `/company-verification/${companyVerificationId}/approve?status=${status}`
        return axiosClient.patch(url);
    }
}

export default managerApi;
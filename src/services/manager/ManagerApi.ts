import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/manager";
        return axiosClient.get(url);
    },

    getAllContract(){
        const url = "/contract/all";
        return axiosClient.get(url);
    },
    // approveCompany(status:string, companyVerificationId:number){
    // const url = `/company-verification/${companyVerificationId}/approve?status=${status}`
    //     return axiosClient.patch(url, {header});
    // }

    approveCompany(status: string, companyVerificationId: number) {
        const url = `/company-verification/${companyVerificationId}/approve?status=${status}`;

        return axiosClient.patch(url, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Gửi token
                "Content-Type": "application/json",
                Role: "manager" // Nếu server yêu cầu role
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
    }
}

export default managerApi;
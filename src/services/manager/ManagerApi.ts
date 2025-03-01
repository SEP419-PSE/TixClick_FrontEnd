import axiosClient from "../axiosClient";



const managerApi = {
    getAllCompany() {
        const url = "/company/all";
        return axiosClient.get(url);
    }
}

export default managerApi;
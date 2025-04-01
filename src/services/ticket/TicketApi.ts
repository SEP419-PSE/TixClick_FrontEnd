import axiosClient from "../axiosClient";

const ticketApi = {
    getAllTickets() {
        const url = "/ticket-purchase/all_of_account";
        const token = localStorage.getItem('accessToken');
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
}

export default ticketApi;
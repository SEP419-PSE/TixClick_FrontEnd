import axiosClient from "../axiosClient";

const profileApi = {

    getProfile(headers = {}) {
        const url = "/account/my-profile";
        return axiosClient.get(url, { headers });
      }
      
}

export default profileApi;
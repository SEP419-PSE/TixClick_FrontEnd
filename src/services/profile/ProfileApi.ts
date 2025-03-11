import axiosClient from "../axiosClient";

const profileApi = {

    getProfile() {
        const url = "/account/my-profile";
        return axiosClient.get(url);
      }
      
}

export default profileApi;
import axiosClient from "../axiosClient";

const profileApi = {

    getProfile() {
        const url = "/account/my-profile";
        return axiosClient.get(url);
      },

    updateProfile(data: any) {
        const url = "/account/update-profile";
        return axiosClient.post(url, data);
      },
      
}

export default profileApi;
import { Profile } from "../../interface/profile/Profile";
import axiosClient from "../axiosClient";

const profileApi = {

    getProfile() {
        const url = "/account/my-profile";
        return axiosClient.get(url);
      },

    updateProfile(data: Profile) {
        const url = "/account/update-profile";
        return axiosClient.post(url, data);
      },
      
}

export default profileApi;
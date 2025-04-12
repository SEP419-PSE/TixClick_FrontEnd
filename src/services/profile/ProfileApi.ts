import { Profile } from "../../interface/profile/Profile";
import axiosClient from "../axiosClient";

const profileApi = {

    getProfile() {
        const url = "/account/my-profile";
        const token = localStorage.getItem("accessToken");

        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      },

    updateProfile(data: Profile) {
        const url = "/account/update-profile";
        const token = localStorage.getItem("accessToken");

        return axiosClient.put(url,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
      },
      
}

export default profileApi;
import axiosClient from "../axiosClient";

const profileApi = {
  getProfile() {
    const url = "/account/my-profile";
    const token = localStorage.getItem("accessToken");

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAdminProfile() {
    const url = "/account/my-profile";
    const token = localStorage.getItem("accessToken2");

    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // updateProfile(data: Profile) {
  //     const url = "/account/update-profile";
  //     const token = localStorage.getItem("accessToken");

  //     return axiosClient.put(url,data, {
  //         headers: {
  //             Authorization: `Bearer ${token}`
  //         }
  //     });
  //   },

  // In ProfileApi.js
  async updateProfile(data: any, avatarFile: File | null) {
    const url = "/account/update-profile";
    const token = localStorage.getItem("accessToken");

    if (!token) {
        throw new Error("No access token found.");
    }

    const formData = new FormData();

    // Append text fields
    if (data.firstName !== undefined) formData.append("firstName", data.firstName);
    if (data.lastName !== undefined) formData.append("lastName", data.lastName);
    if (data.email !== undefined) formData.append("email", data.email);
    if (data.phone !== undefined) formData.append("phone", data.phone);

    if (data.dob !== undefined) {
        const dobValue = data.dob instanceof Date ? data.dob.toISOString() : data.dob;
        formData.append("dob", dobValue);
    }

    if (avatarFile) {
        formData.append("avatarURL", avatarFile); 
    }

    return axiosClient.put(url, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
        },
    });
}


};

export default profileApi;

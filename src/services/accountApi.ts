import axiosClient from "./axiosClient";

const accountUrl = `/account`;

const accountApi = {
  search: (email: string) => {
    const url = `${accountUrl}/search-account?email=${email}`;
    return axiosClient.get(url);
  },
};

export default accountApi;

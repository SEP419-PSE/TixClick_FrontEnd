import { Activity } from "../../components/CreateEvent/steps/StepTwo";
import axiosClient from "../axiosClient";

const eventApi = {
  createEventActivity: (data: Activity[]) => {
    const url = "/event-activity/create";
    return axiosClient.post(url, data);
  },
};

export default eventApi;

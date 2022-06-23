import axios from "axios";
import { API_URL } from "../global/Constants";

export async function directoryAPI(data) {
  try {
    const result = await axios.post(API_URL + "check", data);
    return result;
  } catch (error) {
    return error;
  }
}

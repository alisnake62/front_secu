import axios from "axios";
import { API_URL } from "../global/Constants";

export async function loginAPI(username, password) {
  try {
    const result = await axios.post(
      API_URL + "auth/signin",
      username,
      password
    );
    console.log(result);
    return result;
  } catch (error) {
    return error;
  }
}

export async function getUserIp(ip) {
  try {
    const ip = await axios.get("https://db-ip.com/");
    return ip.data;
  } catch (error) {
    return error;
  }
}

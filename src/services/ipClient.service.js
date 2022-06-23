import axios from "axios";

export default async function getIpClient() {
  try {
    const response = await axios.get("https://geolocation-db.com/json/");
    return response.data;
  } catch (error) {
    return error;
  }
}

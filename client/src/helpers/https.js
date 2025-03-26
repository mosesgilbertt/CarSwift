import axios from "axios";

const https = axios.create({
  baseURL: "http://localhost:3000",
});

export default https;

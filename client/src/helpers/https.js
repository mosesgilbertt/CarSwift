import axios from "axios";

const https = axios.create({
  baseURL: "https://car-swift.superzeco.site",
});

export default https;

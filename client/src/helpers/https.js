import axios from "axios";

const https = axios.create({
  baseURL: "http://car-rent.superzeco.site/",
});

export default https;

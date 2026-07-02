import axios from "axios";

const API = "http://localhost:3001/api/ventes";

export const getVentes = () => axios.get(API);

export const createVente = (data) =>
  axios.post(API, data);
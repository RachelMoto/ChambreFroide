import api from "./api";

export const getVentes = () => api.get("/ventes");

export const createVente = (data) => {
  return api.post("/ventes", data);
};
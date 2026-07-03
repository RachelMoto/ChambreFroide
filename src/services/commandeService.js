import api from "./api";

export const getCommandes = () => {
  return api.get("/commandes");
};

export const createCommande = (data) => {
  return api.post("/commandes", data);
};

export const updateCommande = (id, data) => {
  return api.put(`/commandes/${id}`, data);
};
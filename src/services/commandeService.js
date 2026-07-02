import axios from "axios";

const API ="http://localhost:3001/api/commandes";

export const getCommandes = () =>axios.get(API);

export const createCommande = (data) =>axios.post(API, data);

export const updateCommande = (id,data) => axios.put(`${API}/${id}`,data);
import axios from "axios";

const API = "http://localhost:3001/api/dettes";

export const getDettes = () =>
  axios.get(API);

export const payerDette = (id, montant) => {
  return axios.put(`${API}/${id}/payer`, {
    montant,
  });
};
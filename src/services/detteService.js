import api from "./api";

export const getDettes = () =>api.get("/dettes");

export const payerDette = (id, montant) => {
  return api.put(`/dettes/${id}/payer`, {
    montant,
  });
};
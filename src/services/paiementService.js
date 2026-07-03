import api from "./api";

export const getPaiements = () =>api.get("/paiements");

export const createPaiement = (data) =>
  api.post("/paiements", data);
import api from "./api";

export const getApprovisionnements =() => api.get("/approvisionnements");

export const createApprovisionnement = (data) =>
  api.post("/approvisionnements", data);
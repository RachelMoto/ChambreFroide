import api from "./api"; 

export const getDepenses = () =>api.get("/depenses");

export const createDepense = (data) => {
  return api.post("/depenses", data);
};
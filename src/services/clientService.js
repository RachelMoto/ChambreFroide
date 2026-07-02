import api from "./api";

export const getClients = () => {
  return api.get("/clients");
};

export const createClient = (data) => {
  return api.post("/clients", data);
};
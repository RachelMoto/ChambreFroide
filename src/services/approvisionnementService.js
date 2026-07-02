import axios from "axios";
import api from "./api";

const API ="http://localhost:3001/api/approvisionnements";

export const getApprovisionnements =
() => axios.get(API);

export const createApprovisionnement = (data) =>
  api.post("/approvisionnements", data);
import axios from "axios";
import api from "./api";

const API = "http://localhost:3001/api/paiements";

export const getPaiements = () =>
  api.get("/paiements");

export const createPaiement = (data) =>
  api.post("/paiements", data);
import axios from "axios";

const API =
  "http://localhost:3001/api/depenses";

export const getDepenses = () =>
  axios.get(API);

export const createDepense = (data) =>
  axios.post(API, data);
import axios from "axios";
import api from "./api";

const API = "http://localhost:3001/api/produits";

// Liste des produits (publique)
export const getProduits = () => axios.get(API);

// Ajouter un produit
export const createProduit = (data) =>
  api.post("/produits", data);

// Modifier un produit
export const updateProduit = (id, data) =>
  api.put(`/produits/${id}`, data);

// Réactiver un produit
export const reactiverProduit = (id) =>
  api.put(`/produits/reactiver/${id}`);

// Supprimer un produit
export const deleteProduit = (id) =>
  api.delete(`/produits/${id}`);
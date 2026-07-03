import api from "./api";

// Liste des produits (publique)
export const getProduits = () => api.get("/produits");

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
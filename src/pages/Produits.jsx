import { useEffect, useState } from "react";
import {
  getProduits,
  deleteProduit,
  createProduit,
  reactiverProduit,
  updateProduit,
} from "../services/produitService";
import "../styles/Produit.css";
import { hasPermission } from "../utils/permissionHelper";
import { PERMISSIONS } from "../config/permissions";


function Produits() {
  const [produits, setProduits] = useState([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const user = JSON.parse(localStorage.getItem("user"));

  const getFilteredByStock = () => {
  if (filterType === "STOCK") {
    return produits.filter(p => Number(p.stockActuel) > 10);
  }

  if (filterType === "FAIBLE") {
    return produits.filter(p => Number(p.stockActuel) > 0 && Number(p.stockActuel) <= 10);
  }

  if (filterType === "RUPTURE") {
    return produits.filter(p => Number(p.stockActuel) === 0);
  }

  return produits;
};

  // form ajout produit
  const [form, setForm] = useState({
    nom: "",
    categorie: "",
    stockInitial: "",
    stockActuel: "",
    prixCarton: "",
  });

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
  try {
    const res = await getProduits();
    console.log("DONNEES :", res.data);
    setProduits(res.data);
  } catch (error) {
    console?.error(error);
  }
};

  // DELETE
  const handleDelete = async (id) => {
  try {
    console.log("Suppression produit :", id);

    await deleteProduit(id);

    console.log("Produit supprimé");

    await loadProduits();

  } catch (error) {
    console.error("ERREUR SUPPRESSION :", error);
    console.error("DETAIL :", error.response?.data);
  }
};

  // CREATE
  const handleCreate = async (e) => {
  e.preventDefault();

  // 🔥 VALIDATION
  if (
    !form.nom ||
    !form.categorie ||
    !form.prixCarton ||
    !form.stockInitial
  ) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  if (Number(form.prixCarton) <= 0) {
    alert("Prix invalide");
    return;
  }

  try {
    const result = await createProduit(form);

    setForm({
      nom: "",
      categorie: "",
      stockInitial: "",
      stockActuel: "",
      prixCarton: "",
    });

    await loadProduits();

  } catch (error) {
    console.error(error);
  }
};

const validateProduct = () => {
  if (!form.nom) return alert("Nom obligatoire"), false;
  if (!form.categorie) return alert("Catégorie obligatoire"), false;
  if (!form.prixCarton) return alert("Prix obligatoire"), false;

  return true;
};

  // FILTER SEARCH
 const filteredProduits = getFilteredByStock().filter((p) =>
  (p.nom || "").toLowerCase().includes(search.toLowerCase())
);

const produitsAffiches = filteredProduits; // ou filtre UI

const handleReactiver = async (id) => {
  console.log("Réactivation :", id);

  await reactiverProduit(id);

  loadProduits();
};

  return (
    <div className="page-container">

      {/* HEADER */}
      <div className="produits-header">
        <h1>Produits</h1>
        <p>Tous les produits dans le système</p>
      </div>

      {/* STATS */}
      <div className="stats-cards">

        <div className="card stock" onClick={() => setFilterType("STOCK")}>
          <h3>En stock</h3>
          <span>
            {produits.filter(p => p.actif && Number(p.stockActuel) > 10).length}
          </span>
        </div>

        <div className="card faible"  onClick={() => setFilterType("FAIBLE")}>
          <h3>Stock faible</h3>
          <span>
            {produits.filter( p => p.actif && Number(p.stockActuel) > 0 && Number(p.stockActuel) <= 10).length}
          </span>
        </div>

        <div className="card rupture" onClick={() => setFilterType("RUPTURE")}>
          <h3>Rupture</h3>
          <span>
            {produits.filter(p => p.actif && Number(p.stockActuel) === 0).length}
          </span>
        </div>

      </div>

      {hasPermission(user, PERMISSIONS.PRODUIT_CREATE) && (
      <form className="form-produit" onSubmit={handleCreate}>
        <input
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />

        <input
          placeholder="Catégorie"
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
        />

        <input
           type="number"
           placeholder="Stock initial"
           value={form.stockInitial}
           onChange={(e) =>
           setForm({...form,stockInitial: e.target.value})
         }
        />

        <input
          type="number"
          placeholder="Stock actuel"
          value={form.stockActuel}
          onChange={(e) =>
            setForm({ ...form, stockActuel: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Prix carton"
          value={form.prixCarton}
          onChange={(e) =>
            setForm({ ...form, prixCarton: e.target.value })
          }
        />
      {hasPermission(user, PERMISSIONS.PRODUIT_CREATE) && (
        <button type="submit">Ajouter</button>
        )}
      </form>
      )}
      

      {editProduct && (
  <form
    className="edit-form"
    onSubmit={async (e) => {
  e.preventDefault();

  try {

    await updateProduit(editProduct.id, {
      nom: editProduct.nom,
      categorie: editProduct.categorie,
      prixCarton: editProduct.prixCarton,
    });

    setEditProduct(null);

    loadProduits();

  } catch (error) {
    console.error(error);
  }
}}
  >

    <input
      value={editProduct.nom}
      disabled
    />

    <input
      value={editProduct.categorie}
      onChange={(e) =>
        setEditProduct({
          ...editProduct,
          categorie: e.target.value,
        })
      }
    />

    <input
      value={editProduct.stockInitial}
      disabled
    />

    <input
      value={editProduct.stockActuel}
      disabled
    />

    <input
      type="number"
      value={editProduct.prixCarton}
      onChange={(e) =>
        setEditProduct({
          ...editProduct,
          prixCarton: Number(e.target.value),
        })
      }
    />

    <button type="submit" className="edit-save">
      Sauvegarder
    </button>

    <button
      type="button"
      className="edit-cancel"
      onClick={() => setEditProduct(null)}
    >
      Annuler
    </button>

  </form>
)}

  <div className="produits-section">
      <div className="liste-header">
        <div>
          <h2>Liste des produits</h2>
          <p>Tous les produits dans le système</p>
        </div>

        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="produits-table">

        <thead>
          <tr>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Stock init</th>
            <th>Stock actuel</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
  {filteredProduits.length > 0 ? (
    filteredProduits.map((p) => (
      <tr key={p.id}>
        <td>{p.nom}</td>
        <td>{p.categorie}</td>
        <td>{p.stockInitial}</td>
        <td>{p.stockActuel}</td>
        <td>{p.prixCarton}</td>
        <td>
           <span className={p.actif ? "actif" : "desactive"}>
              {p.actif ? "Actif" : "Désactivé"}
           </span>
        </td>
        <td>
          <div className="button-action">
            {hasPermission(user, PERMISSIONS.PRODUIT_UPDATE) && (
          <button className="button-edit" onClick={() => setEditProduct(p)}>Modifier</button>)}
          {hasPermission(user, PERMISSIONS.PRODUIT_UPDATE) && (
  p.actif ? (
    <button
      className="button-delete"
      onClick={() => handleDelete(p.id)}
    >
      Désactiver
    </button>
  ) : (
    hasPermission(user, PERMISSIONS.PRODUIT_REACTIVER) && (
      <button
        className="button-reactiver"
        onClick={() => handleReactiver(p.id)}
      >
        Réactiver
      </button>
    )
  )
)}
          </div>
          
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">Aucun produit trouvé</td>
    </tr>
  )}
</tbody>

      </table>
  </div>

 </div>
  );

  
}

export default Produits;
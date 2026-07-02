import { useEffect, useState } from "react";
import {
  getApprovisionnements,
  createApprovisionnement,
} from "../services/approvisionnementService";
import { getProduits } from "../services/produitService";
import "../styles/Approvisionnement.css";
import { hasPermission } from "../utils/permissionHelper";
import { PERMISSIONS } from "../config/permissions";

function Approvisionnement() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [approvisionnements, setApprovisionnements] = useState([]);
  const [produits, setProduits] = useState([]);

  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [fournisseur, setFournisseur] = useState("");
 

  useEffect(() => {
    loadProduits();
    loadApprovisionnements();
  }, []);

  const loadProduits = async () => {
    try {
      const res = await getProduits();
      setProduits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadApprovisionnements = async () => {
    try {
      const res = await getApprovisionnements();
      setApprovisionnements(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApprovisionnement = async () => {
    try {
      if (!produitId || !quantite) {
        alert("Produit et quantité obligatoires");
        return;
      }

      if (!quantite || Number(quantite) <= 0) {
      alert("La quantité doit être supérieure à 0");
      return;
    }


      await createApprovisionnement({
        produitId,
        quantite,
        prixAchat,
        fournisseur,
      });

      alert("Approvisionnement enregistré");

      setProduitId("");
      setQuantite("");
      setPrixAchat("");
      setFournisseur("");

      loadApprovisionnements();
      loadProduits();
    } catch (error) {
      //console.log(error);
      console.log(error.response?.data);
    }
  };

  const produitsActifs = produits.filter(
  (p) => p.actif
);

  return (
    <div className="approvisionnement-container">

      <div className="approvisionnement-header">
        <h1>Approvisionnement</h1>
        <p>Gestion des entrées de stock</p>
      </div>
     {hasPermission(user, PERMISSIONS.APPROVISIONNEMENT_CREATE) && (
      <div className="form-approvisionnement">

        <select
          value={produitId}
          onChange={(e) =>
            setProduitId(e.target.value)
          }
        >
          <option value="">
            Choisir un produit
          </option>

          {produitsActifs.map((produit) => (
            <option
              key={produit.id}
              value={produit.id}
            >
              {produit.nom}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantité"
          value={quantite}
          onChange={(e) =>
            setQuantite(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Prix d'achat"
          value={prixAchat}
          onChange={(e) =>
            setPrixAchat(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Fournisseur"
          value={fournisseur}
          onChange={(e) =>
            setFournisseur(e.target.value)
          }
        />
       
        <button
          className="btn-approvisionnement"
          onClick={handleApprovisionnement}
        >
          Approvisionner
        </button>
        

      </div>
      )}

  <div className="approvisionnement-section">
    <h2>📊 Historique d'approvisionnement</h2>

      <div className="table-container">

        <table className="approvisionnement-table">

          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix Achat unitaire</th>
              <th>Montant Total</th>
              <th>Fournisseur</th>
              <th>Stock Avant</th>
              <th>Stock Après</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {approvisionnements.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.produit?.nom}
                </td>

                <td>
                  {a.quantite}
                </td>

                <td>
                  {a.prixAchat || 0} FC
                </td>

                <td>
                  {Number(a.quantite) * Number(a.prixAchat)} FC
                </td>

                <td>
                  {a.fournisseur || "-"}
                </td>

                <td>{a.stockAvant}</td>
                <td>{a.stockApres}</td>

                <td>
                  {new Date(
                    a.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      

      </div>
    </div>
    

    </div>
  );
}

export default Approvisionnement;
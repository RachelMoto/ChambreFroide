import { useEffect, useState } from "react";
import "../styles/Commande.css";

import {
  getCommandes,
  createCommande,
  updateCommande,
} from "../services/commandeService";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { getProduits } from "../services/produitService";


function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState("");
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [search, setSearch] = useState("");
  const [lignesCommande, setLignesCommande] = useState([]);
  const [commandeToValidate, setCommandeToValidate] = useState(null);
  const [quantitesValidees, setQuantitesValidees] = useState({});
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadProduits();
    loadCommandes();
  }, []);

  const loadProduits = async () => {
    try {
      const res = await getProduits();
      setProduits(res.data.filter((p) => p.actif));
    } catch (error) {
      console.log(error);
    }
  };

  const loadCommandes = async () => {
    try {
      const res = await getCommandes();
      setCommandes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE COMMANDE
  const handleCreateCommande = async () => {
    if (panier.length === 0) {
  alert("Ajoutez au moins un produit au panier");
  return;
}
    try {
      await createCommande({
        prenom,
        telephone,
        produits: panier,
      });

      alert("Commande enregistrée");

      setPrenom("");
      setTelephone("");
      setProduitId("");
      setQuantite("");
      setPanier([]);

      loadCommandes();
    } catch (error) {
      console.log(error);
    }
  };

  // AJOUT PANIER
  const ajouterProduit = () => {
    const produit = produits.find((p) => p.id == produitId);
    if (!produit) return;

    setPanier([
      ...panier,
      {
        produitId: produit.id,
        nom: produit.nom,
        quantite: Number(quantite),
      },
    ]);

    setProduitId("");
    setQuantite("");
  };

  const ouvrirValidation = (commande) => {
  setCommandeToValidate(commande);

  const init = {};

  commande.lignes.forEach((ligne) => {
    init[ligne.id] = ligne.quantite;
  });

  setQuantitesValidees(init);
};

  const confirmerCommande = async () => {
    const quantitesFinales = {};

commandeToValidate.lignes.forEach((ligne) => {
  quantitesFinales[ligne.id] =
    quantitesValidees[ligne.id] ??
    Number(ligne.quantite);
});
    console.log(quantitesFinales);
  try {
    await updateCommande(commandeToValidate.id, {
      statut: "VENDUE",
      quantites: quantitesFinales,
    });

    setCommandeToValidate(null);
    setQuantitesValidees({});
    await loadCommandes();
  } catch (error) {
    console.log(error);
  }
};

  // CHANGER STATUT (CORRIGÉ)
  const changerStatut = async (id, statut) => {
  try {
    await updateCommande(id, { statut });

    await loadCommandes();
  } catch (error) {
    console.log(error);
  }
};

  const produitsActifs = produits.filter((p) => p.actif);

  const filteredCommandes = commandes.filter((commande) =>
  commande.lignes?.some((ligne) =>
    (ligne.produit?.nom || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  )
);

const encours = commandes.filter(
  (c) => c.statut === "EN_COURS"
);

const vendues = commandes.filter(
  (c) => c.statut === "VENDUE"
);

const annulees = commandes.filter(
  (c) => c.statut === "ANNULEE"
);

  return (
  <div className="page-container">

    {/* FORMULAIRE COMMANDE */}
    <div className="form-commande">

      <input
        type="text"
        placeholder="Nom client"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />

      <PhoneInput
  defaultCountry="cd"
  value={telephone}
  onChange={(phone) => setTelephone(phone)}
  inputProps={{
    placeholder: "Téléphone",
  }}
  
/>

      <select
        value={produitId}
        onChange={(e) => setProduitId(e.target.value)}
      >
        <option value="">Choisir un produit</option>

        {produitsActifs.map((produit) => (
          <option key={produit.id} value={produit.id}>
            {produit.nom}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantité"
        value={quantite}
        onChange={(e) => setQuantite(e.target.value)}
      />

      <button
        type="button"
        className="btn-ajouter"
        onClick={ajouterProduit}
      >
        Ajouter au panier
      </button>

      {panier.map((item, index) => (
        <div key={index}>
          {item.nom} - Quantité : {item.quantite}
        </div>
      ))}

      <button
        className="btn-commande"
        onClick={handleCreateCommande}
      >
        Enregistrer
      </button>

    </div>

    {/* HEADER */}
    <div className="commandes-header">
      <h1>Commandes</h1>
      <p>Suivez toutes les commandes de vos clients</p>
    </div>

    {/* CARDS STATUTS */}
    <div className="stats-cards">

      <div
        className="card encours"
        onClick={() => setFilter("EN_COURS")}>
        <h3>Commandes en cours</h3>
        <span>{encours.length}</span>
      </div>

      <div
        className="card vendues"
        onClick={() => setFilter("VENDUE")}
      >
        <h3>Commandes vendues</h3>
        <span>{vendues.length}</span>
      </div>

      <div
        className="card annulees"
        onClick={() => setFilter("ANNULEE")}
      >
        <h3>Commandes annulées</h3>
        <span>{annulees.length}</span>
      </div>

    </div>

  
<div className="liste-section">
      <div className="liste-header">
        <div>
          <h2>Liste des commandes</h2>
          <p>Toutes les commandes passées</p>
        </div>
        

        <input type="text" placeholder="🔍 Rechercher un produit..." value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
      </div>

 <table className="commande-table">
  <thead>
    <tr>
      <th>Client</th>
      <th>Téléphone</th>
      <th>Produits</th>
      <th>Quantité</th>
      <th>Montant</th>
      <th>Date</th>
      <th>Statut</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
  {filteredCommandes.length > 0 ? (
    filteredCommandes.map((commande) => (
      <tr key={commande.id}>

        <td>
          {commande.client?.prenom || "Client inconnu"}
        </td>
        <td>
          {commande.client?.telephone? commande.client.telephone : "-"}
        </td>

        <td>
          {commande.lignes.map((ligne) => (
         <div key={ligne.id}>
           {ligne.produit?.nom} x{ligne.quantite}
         </div>
        ))}
        </td>

        <td>
          {commande.lignes?.reduce(
            (total, ligne) =>
              total + Number(ligne.quantite),
            0
          )}
        </td>

        <td>
          {Number(commande.montant)} FC
        </td>

        <td>
          {new Date(commande.createdAt).toLocaleDateString()}
        </td>

        <td>
          {commande.statut}
        </td>

        <td>
          {commande.statut === "EN_COURS" && (
            <>
            <div className="btn">
              <button className="btn-valider" onClick={() => ouvrirValidation(commande)}>
                   Valider
              </button>

              <button
                className="btn-annuler"
                onClick={() =>
                  changerStatut(commande.id, "ANNULEE")
                }
              >
                Annuler
              </button>
              
              
              </div>
            </>
          )}
        </td>

      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="no-data">
        Aucune commande trouvée
      </td>
    </tr>
  )}
</tbody>
</table>
</div>

{commandeToValidate && (
  <div className="modal-validation">

    <h3>
      Validation de la commande
    </h3>

    <p>
      Client :
      {commandeToValidate.client?.prenom}
    </p>

    {commandeToValidate.lignes.map((ligne) => (
      <div key={ligne.id}>
        <label>
          {ligne.produit.nom}
        </label>

        <input type="number" value={quantitesValidees[ligne.id] ??ligne.quantite}
            min="0"
            max={ligne.quantite}
            onChange={(e) =>
            setQuantitesValidees({
              ...quantitesValidees,
              [ligne.id]: Number(e.target.value),
                })
                 }
          />
      </div>
    ))}

    <button
  onClick={async () => {
    console.log(quantitesValidees);

    await updateCommande(
      commandeToValidate.id,
      {
        statut: "VENDUE",
        quantites: quantitesValidees,
      }
    );

    setCommandeToValidate(null);
    setQuantitesValidees({});
    await loadCommandes();
  }}
>
  Confirmer
</button>

    <button
      onClick={() =>
        setCommandeToValidate(null)
      }
    >
      Fermer
    </button>

  </div>
)}

    </div>
  );
}

export default Commandes;
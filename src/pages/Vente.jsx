import { useEffect, useState } from "react";
import api from "../services/api";
import { getProduits } from "../services/produitService";
import { createVente, getVentes } from "../services/venteService";
import "../styles/Vente.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  FaBox,
  FaShoppingCart,
  FaTrash,
  FaMoneyBillWave,
  FaCreditCard,
  FaUndo
} from "react-icons/fa";
import HistoriqueVente from "./HistoriqueVentes";

const Vente = () => {

  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [saleType, setSaleType] = useState("");
  const [refreshHistorique, setRefreshHistorique] = useState(0);


  const [client, setClient] = useState({
  prenom: "",
  telephone: "",
  acompte:0,
});

const [ventes, setVentes] = useState([]);


  // Charger produits
  useEffect(() => {
    const load = async () => {
      try {
        const produitsActifs = produits.filter( (p) => p.actif);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  useEffect(() => {
  loadProduits();
 
}, []);



const loadProduits = async () => {
  try {
    const res = await getProduits();
    setProduits(
  res.data.filter((produit) => produit.actif)
);
  } catch (err) {
    console.log(err);
  }
};

  // Ajouter au panier
  const addToCart = (produit) => {

  const exist = panier.find(
    p => p.id === produit.id
  );

  if (exist) {

    if (
      exist.quantity >=
      Number(produit.stockActuel)
    ) {
      alert(
        `Stock insuffisant. Disponible : ${produit.stockActuel}`
      );
      return;
    }

    setPanier(
      panier.map(p =>
        p.id === produit.id
          ? {
              ...p,
              quantity: p.quantity + 1,
            }
          : p
      )
    );

  } else {

    if (
      Number(produit.stockActuel) <= 0
    ) {
      alert(
        "Produit en rupture de stock"
      );
      return;
    }

    setPanier([
      ...panier,
      {
        ...produit,
        quantity: 1,
      },
    ]);
  }
};

  // Total
  const total = panier.reduce(
    (sum, item) => sum + item.prixCarton * item.quantity,
    0
  );

  // Vente comptant
  const handleCashSale = async () => {
  try {

    await createVente({
      clientId: null,

      panier: panier.map(item => ({
        id: item.id,
        quantite: item.quantity,
        prixCarton: item.prixCarton,
      })),

      typePaiement: "COMPTANT",
    });

    alert("Vente comptant enregistrée");
    await loadVentes();
    await loadProduits();

    setPanier([]);
    setShowModal(false);

  } catch (error) {
    console.log(error);
  }
};
const openCashSale = () => {
  setSaleType("COMPTANT");
  setShowModal(true);
};

const telephoneValide = (telephone) => {
  const chiffres = telephone.replace(/\D/g, "");

  // RDC : indicatif 243, il faut au moins quelques chiffres après
  return chiffres.length > 3;
};

  // Vente crédit
  const handleCreditSale = async () => {

  const clientId = prompt("ID du client");

  if (!clientId) return;

  try {

    await createVente({
      clientId: Number(clientId),

      panier: panier.map(item => ({
        id: item.id,
        quantite: item.quantity,
        prixCarton: item.prixCarton,
      })),

      typePaiement: "CREDIT",
    });

    alert("Vente crédit enregistrée");
    await loadVentes();
    await loadProduits();

    setPanier([]);
    setShowModal(false);

  } catch (error) {
    console.log(error);
  }
};
const openCreditSale = () => {
  setSaleType("CREDIT");
  setShowModal(true);
};

const confirmSale = async () => {

  if (panier.length === 0) {
    alert("Ajoute des produits au panier");
    return;
  }

  if (!client.prenom || !client.telephone) {
    alert("Nom et téléphone obligatoires");
    return;
  }

  if (!telephoneValide(client.telephone)) {
  alert("Veuillez saisir un numéro de téléphone valide.");
  return;
}

  // Récupération de l'acompte une seule fois
  const acompte = Number(client.acompte || 0);

// Vérification du nom
if (!client.prenom.trim()) {
  alert("Le nom du client est obligatoire.");
  return;
}

// Vérification du téléphone
const chiffres = client.telephone.replace(/\D/g, "");

if (chiffres.length <= 3) {
  alert("Veuillez saisir un numéro de téléphone valide.");
  return;
}

if (saleType === "CREDIT") {

  if (acompte <= 0) {
    alert("Acompte obligatoire pour une vente crédit.");
    return;
  }

  if (acompte > total) {
    alert(
      "L'acompte ne peut pas être supérieur au montant total à payer."
    );
    return;
  }

  }

  const confirmation = window.confirm(
    "Voulez-vous enregistrer cette vente ?"
  );

  if (!confirmation) {
    return;
  }

  try {
    const res = await api.post(
      "/ventes",
      {
        client: {
          prenom: client.prenom,
          telephone: client.telephone,
        },
        type: saleType,
        acompte: Number(client.acompte || 0),
        produits: panier.map(item => ({
          produitId: item.id,
          quantite: item.quantity,
          prixUnitaire: item.prixCarton,
        })),
      }
    );

    if (res.status === 200 || res.status === 201) {
      alert("Vente enregistrée");
    }

    await loadProduits();
    setRefreshHistorique(prev => prev + 1);

    resetModal();
    setPanier([]);
    setShowModal(false);

  } catch (err) {
    console.log(err);
    alert(err.response?.data?.error || "Erreur lors de la vente");
  }
};

const closeModal = () => {
  setShowModal(false);
};

const resetModal = () => {
  setSaleType(""); // 🔥 IMPORTANT : reset type
  setClient({
    prenom: "",
    telephone: "",
    acompte: 0,
  });
  setPanier([]); // optionnel mais recommandé
  setShowModal(false);
};

  return (
    <div className="vente-container">

      <div className="vente-top">

      {/* PRODUITS */}
      <div className="produits-section">

        <h2><FaBox /> Produits disponibles</h2>

        <div className="produits-grid">

          {produits.map(prod => (
            <div key={prod.id} className="produit-card">

              <h3>{prod.nom}</h3>
              <p>{prod.categorie}</p>
              <p><b>{prod.prixCarton} FC</b></p>

              <button onClick={() => addToCart(prod)}>
                Ajouter
              </button>

            </div>
          ))}

        </div>
      </div>
    

      {/* PANIER */}
      <div className="panier-section">

        <h2><FaShoppingCart /> Panier</h2>
        <span>
            {panier.length} article(s)
        </span>

        {panier.length === 0 ? (
          <p>Panier vide</p>
        ) : (
          <>
            {panier.map(item => (
              <div key={item.id} className="panier-item">
                <p>{item.nom}</p>
                <p>x{item.quantity}</p>
                <p>{item.prixCarton * item.quantity} FC</p>
              </div>
            ))}
          </>
        )}

        <hr />

        <div className="total-box">
            <h3>Total à payer</h3>
            <span>{total} FC</span>
          </div>

        <div className="actions">

          <button
  disabled={panier.length === 0}
  onClick={openCashSale}
>
  <FaMoneyBillWave />
  Vente Comptant
</button>

<button
  disabled={panier.length === 0}
  onClick={openCreditSale}
>
  <FaCreditCard />
  Vente Crédit
</button>
          <button onClick={() => setPanier([])}>
           <FaUndo /> Vider panier
          </button>


        </div>

    </div>
        {showModal && (

  <div className="modal-overlay">
   
  <div className="sale-modal">
   <button
  className="close-modal"
  onClick={resetModal}
>
  ×
</button>

    <h3>
      {saleType === "COMPTANT"
        ? "Vente Comptant"
        : "Vente Crédit"}
    </h3>

    <div className="sale-champs">

      <input type="text" placeholder="Nom du client"
         value={client.prenom}
         onChange={(e) =>
        setClient({
          ...client,
          prenom: e.target.value,
        })
      }
      />

      <PhoneInput
  defaultCountry="cd"
  value={client.telephone}
  onChange={(phone) =>
    setClient({
      ...client,
      telephone: phone,
    })
  }
  phoneInputStyle={{
    width: "100%",
    height: "100%",
  }}
  buttonStyle={{
    border: "1px solid #ccc",
  }}
/>

      {saleType === "CREDIT" && (
      <input
        type="number"
        placeholder="Montant de l'acompte"
        value={client.acompte || ""}
        onChange={(e) =>
          setClient({
            ...client,
            acompte: Number(e.target.value),
          })
        }
      />
    )}

      <button
      onClick={() =>
        confirmSale()
      }
      >
      Confirmer la vente
      </button>
    </div>
</div>
    

  </div>

)};

      </div>
      <HistoriqueVente  refresh={refreshHistorique} />

      
    </div>

    

    

  );
};

export default Vente;
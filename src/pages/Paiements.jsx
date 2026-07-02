import api from "../services/api";
import { useState, useEffect } from "react";
import { getPaiements, createPaiement } from "../services/paiementService";
import "../styles/paiement.css";

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [montant, setMontant] = useState("");
  const [selectedDette, setSelectedDette] = useState(null);
  const [periode, setPeriode] = useState("JOUR");

  // 🔥 Charger paiements
const loadPaiements = async () => {
  try {
    const res = await api.get("/paiements");
    console.log("PAIEMENTS API:", res.data);

    setPaiements(res.data);
  } catch (error) {
    console.log(error);
  }
};

  // 🔥 Créer paiement
  const handlePaiement = async () => {
    try {
      if (!selectedDette || !montant) return;

      await createPaiement({
        detteId: selectedDette.id,
        montant: Number(montant),
      });

      setMontant("");
      loadPaiements();
      loadDettes(); // si tu utilises dette ailleurs

    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 useEffect principal
  useEffect(() => {
    loadPaiements();

    const interval = setInterval(() => {
      loadPaiements();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date();

const paiementsJour = paiements.filter((p) =>
  new Date(p.createdAt).toDateString() === today.toDateString()
);

const paiementsSemaine = paiements.filter((p) => {
  const diff =
    (today - new Date(p.createdAt)) /
    (1000 * 60 * 60 * 24);

  return diff <= 7;
});

const paiementsMois = paiements.filter((p) => {
  const date = new Date(p.createdAt);

  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
});

const total = (list) =>
  list.reduce((sum, p) => sum + Number(p.montant), 0);

const totalJour = total(paiementsJour);
const totalSemaine = total(paiementsSemaine);
const totalMois = total(paiementsMois);



const filtrerParPeriode = (liste) => {

  const aujourdHui = new Date();

  return liste.filter((item) => {

    const date = new Date(item.createdAt);

    switch (periode) {

      case "JOUR":
        return (
          date.toDateString() ===
          aujourdHui.toDateString()
        );

      case "SEMAINE":
        return (
          (aujourdHui - date) /
            (1000 * 60 * 60 * 24) <=
          7
        );

      case "MOIS":
        return (
          date.getMonth() ===
            aujourdHui.getMonth() &&
          date.getFullYear() ===
            aujourdHui.getFullYear()
        );

      case "ANNEE":
        return (
          date.getFullYear() ===
          aujourdHui.getFullYear()
        );

      default:
        return true;
    }

  });

};

const paiementsFiltres =
  filtrerParPeriode(paiements);

  const totalGlobal =
  paiementsFiltres.reduce(
    (sum, p) => sum + Number(p.montant),
    0
  );


  return (
    <div className="paiements-container">

      

      <div className="paiements-header">
        <h1>Paiements des dettes</h1>
        <p>Suivi de tous les paiements des dettes effectués</p>
      </div>

      <div className="stats-cards">

  <div className="card paiement-jour">
    <h3>Paiements du jour</h3>
    <p>{totalJour} FC</p>
  </div>

  <div className="card paiement-semaine">
    <h3>Paiements semaine</h3>
    <p>{totalSemaine} FC</p>
  </div>

  <div className="card paiement-mois">
    <h3>Paiements mois</h3>
    <p>{totalMois} FC</p>
  </div>

  

</div>

<div className="historique-container">
        
  <div className="historique-top">
    <h2>📊 Historique des paiements des dettes</h2>

    <div className="periode-filter">

  <button onClick={() => setPeriode("JOUR")}>
    Aujourd'hui
  </button>

  <button onClick={() => setPeriode("SEMAINE")}>
    Cette semaine
  </button>

  <button onClick={() => setPeriode("MOIS")}>
    Ce mois
  </button>

  <button onClick={() => setPeriode("ANNEE")}>
    Cette année
  </button>

  <div className="total-periode">
  Total :
  <strong>
    {totalGlobal.toLocaleString()} FC
  </strong>
</div>
</div>
        
  </div>
        <table className="paiement-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Montant</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {paiementsFiltres.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucun paiement enregistré
                </td>
              </tr>
            ) : (
              paiementsFiltres.map((p)=> (
                <tr key={p.id}>
                  <td>{p.dette?.client?.prenom}</td>

                  <td className="montant">
                    {p.montant} FC
                  </td>
                <td>
                  <span className="badge-paiement">
                      {p.modePaiement}
                  </span>
                </td>

                  <td className="date-paiement">
                    {new Date(
                      p.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      

    </div>
  );
}

export default Paiements;
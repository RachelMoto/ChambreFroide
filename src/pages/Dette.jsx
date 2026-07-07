import { useEffect, useState } from "react";
import {
  getDettes,
  payerDette,
} from "../services/detteService";
import "../styles/Dette.css";

function Dettes() {

  const [dettes, setDettes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDette, setSelectedDette] = useState(null);
  const [montantPaiement, setMontantPaiement] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [periode, setPeriode] = useState("JOUR");

  const loadDettes = async () => {
    try {
      const res = await getDettes();
      setDettes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDettes();
  }, []);

  const openPaiementModal = (dette) => {
  setSelectedDette(dette);
  setMontantPaiement("");
  setShowModal(true);
};
const confirmPaiement = async () => {
  if (loading) return;
  if (!selectedDette) return;

  if (
    montantPaiement === "" ||
    montantPaiement === null ||
    Number(montantPaiement) <= 0
  ) {
    alert("Veuillez saisir un montant valide.");
    return;
  }

  try {
    setLoading(true);

    await payerDette(
      selectedDette.id,
      Number(montantPaiement)
    );

    alert("Paiement enregistré");

    setShowModal(false);

    await loadDettes(); // ✔ suffisant

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.error ||
      "Erreur lors du paiement"
    );

  } finally {
    setLoading(false);
  }
};

  const dettesActives = dettes.filter(
    d => d.statut === "EN_COURS"
  );

  const dettesSoldees = dettes.filter(
    d => d.statut === "PAYEE"
  );

  const montantRestant =
    dettes.reduce(
      (sum, d) =>
        sum + Number(d.resteAPayer),
      0
    );

    const filteredDettes = dettes.filter((d) => {

  if (filter === "ACTIVES")
    return d.statut === "EN_COURS";

  if (filter === "SOLDEES")
    return d.statut === "PAYEE";

  if (filter === "RESTE") {
    return Number(d.resteAPayer) > 0;
  }

  return true;
});

const filtrerParPeriode = (liste) => {
  const aujourdHui = new Date();

  return liste.filter((item) => {
    const date = new Date(item.createdAt);

    switch (periode) {
      case "JOUR":
        return date.toDateString() === aujourdHui.toDateString();

      case "SEMAINE":
        return (
          (aujourdHui - date) /
            (1000 * 60 * 60 * 24) <=
          7
        );

      case "MOIS":
        return (
          date.getMonth() === aujourdHui.getMonth() &&
          date.getFullYear() === aujourdHui.getFullYear()
        );

      case "ANNEE":
        return (
          date.getFullYear() === aujourdHui.getFullYear()
        );

      default:
        return true;
    }
  });
};

const dettesFiltrees = filtrerParPeriode(dettes);

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Dettes Clients</h1>
        <p>
          Suivi des créances et paiements clients
        </p>
      </div>

      <div className="stats-cards">

         <div className="card danger"
            onClick={() => setFilter("ACTIVES")}>
            <h3>Dettes actives</h3>
            <span>{dettes.filter(d => d.statut === "EN_COURS").length}</span>
          </div>

          <div className="card warning"
             onClick={() => setFilter("RESTE")}>
             <h3>Montant restant</h3>
              <span>{dettes.reduce((sum, d) => sum + Number(d.resteAPayer), 0)} FC</span>
          </div>

          <div className="card success"
            onClick={() => setFilter("SOLDEES")}>
             <h3>Dettes soldées</h3>
             <span>{dettes.filter(d => d.statut === "PAYEE").length}</span>
          </div>

      </div>

    <div className="dette-section">

      <div className="liste-header">
        <div>
          <h2>Liste des dettes</h2>
          <p>
            Toutes les dettes enregistrées
          </p>
        </div>
      </div>

      <div className="periode-filter">

  <button
    className={periode === "JOUR" ? "active" : ""}
    onClick={() => setPeriode("JOUR")}
  >
    Aujourd'hui
  </button>

  <button
    className={periode === "SEMAINE" ? "active" : ""}
    onClick={() => setPeriode("SEMAINE")}
  >
    Cette semaine
  </button>

  <button
    className={periode === "MOIS" ? "active" : ""}
    onClick={() => setPeriode("MOIS")}
  >
    Ce mois
  </button>

  <button
    className={periode === "ANNEE" ? "active" : ""}
    onClick={() => setPeriode("ANNEE")}
  >
    Cette année
  </button>

</div>

      <table className="dette-table">

        <thead>
          <tr>
            <th>Client</th>
            <th>Montant Total</th>
            <th>Montant Payé</th>
            <th>Reste à payer</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {dettes.length > 0 ? (

            dettesFiltrees.map((dette) => (

              <tr key={dette.id}>

                <td>
                  {dette.client?.prenom}
                </td>

                <td>
                  {Number(dette.montantTotal)} FC
                </td>

                <td>
                  {Number(dette.montantPaye)} FC
                </td>

                <td>
                  {Number(dette.resteAPayer)} FC
                </td>

                <td>
                  {dette.statut}
                </td>

                <td>
                  {new Date(
                    dette.createdAt
                  ).toLocaleDateString()}
                </td>

                <td>

                  {dette.statut === "PAYEE" ? (
                    <span className="badge-paid">Payé</span>
                    ) : (
                    <button onClick={() => openPaiementModal(dette)}>
                         Payer
                    </button>
                      )}

                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan="7"
                className="no-data"
              >
                Aucune dette enregistrée
              </td>
            </tr>

          )}

        </tbody>

      </table>
    </div>

      {showModal && (

  <div className="modal-overlay">

    <div className="modal-paiement">

      <h3>Paiement de dette</h3>

      <p>
        Client :
        <strong>
          {" "}
          {selectedDette?.client?.prenom}
        </strong>
      </p>

      <p>
        Reste à payer :
        <strong>
          {" "}
          {selectedDette?.resteAPayer} FC
        </strong>
      </p>

      <input
        type="number"
        placeholder="Montant du paiement"
        value={montantPaiement}
        onChange={(e) =>
          setMontantPaiement(
            e.target.value
          )
        }
      />

      <div className="modal-actions">

        <button onClick={confirmPaiement} disabled={loading}>
           {loading ? "Traitement..." : "Confirmer"}
        </button>

        <button
          onClick={() =>
            setShowModal(false)
          }
        >
          Annuler
        </button>

      </div>

    </div>

  </div>

)}

    </div>
  );
}

export default Dettes;
import { useEffect, useState } from "react";
import { getVentes } from "../services/venteService";
import "../styles/HistoriqueVente.css";

const HistoriqueVente = ({ refresh }) => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("JOUR");

  useEffect(() => {
    loadVentes();
  }, [refresh]);

  const loadVentes = async () => {
    try {
      const res = await getVentes();
      setVentes(res.data);
    } catch (error) {
      console.log("Erreur chargement ventes :", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVentes = ventes.reduce(
  (sum, v) => sum + Number(v.montant || 0),
  0
);

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
          (1000 * 60 * 60 * 24) <= 7
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
        return true; // "TOUT"
    }
  });
};

const historiqueVenteFiltres = filtrerParPeriode(ventes);

const totalGlobal = historiqueVenteFiltres.reduce((sum, v) => {

  // 💰 vente comptant
  if (v.type === "COMPTANT") {
    return sum + Number(v.montant);
  }

  // 💳 vente crédit → on NE prend PAS le total
  if (v.type === "CREDIT") {

    const acompte =
      v.client?.dettes?.find(
        (d) =>
          Number(d.montantTotal) === Number(v.montant)
      )?.montantPaye || 0;

    return sum + Number(acompte);
  }

  return sum;

}, 0);

if (loading) {
  return <p>Chargement de l’historique...</p>;
}

  return (
  <div className="historique-container">

  {/* HEADER + FILTRE */}
  <div className="historique-top">

    <div className="historique-header">
      <h2>📊 Historique des ventes</h2>
      <p>
        Total de la période :
        <b> {totalGlobal.toLocaleString()} FC</b>
      </p>
    </div>

    {/* FILTRE */}
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

  </div>

  {/* TABLE */}
  <table className="historique-table">

    <thead>
      <tr>
        <th>Client</th>
        <th>Téléphone</th>
        <th>Produits</th>
        <th>Montant</th>
        <th>Type</th>
        <th>Acompte</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {historiqueVenteFiltres.length > 0 ? (
        historiqueVenteFiltres.map((vente) => (
          <tr key={vente.id}>

            <td>{vente.client?.prenom || "Client inconnu"}</td>

            <td>{vente.client?.telephone || "-"}</td>

            <td>
              {vente.lignes?.map((l, i) => (
                <div key={i}>
                  {l.produit.nom} x {l.quantite}
                </div>
              ))}
            </td>

            <td>{Number(vente.montant).toLocaleString()} FC</td>

            <td>
              {vente.type === "CREDIT"
                ? "💳 Crédit"
                : "💵 Comptant"}
            </td>

            <td>
              {Number(
                vente.client?.dettes?.find(
                  (d) =>
                    Number(d.montantTotal) === Number(vente.montant)
                )?.montantPaye || 0
              ).toLocaleString()} FC
            </td>

            <td>
              {new Date(vente.createdAt).toLocaleDateString()}
            </td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">Aucune vente enregistrée</td>
        </tr>
      )}
    </tbody>

  </table>

</div>

    
  );
};

export default HistoriqueVente;
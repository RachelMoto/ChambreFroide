import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Caisse.css";

const Caisse = () => {
  const [caisse, setCaisse] = useState([]);
  const [periode, setPeriode] = useState("JOUR");

  useEffect(() => {
    loadCaisse();
  }, []);

  const loadCaisse = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      const res = await axios.get(
        "http://localhost:3001/api/caisse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCaisse(res.data);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const today = new Date();

  /* ================= HELPERS ================= */
  const isSameDay = (date) =>
    new Date(date).toDateString() === today.toDateString();

  const isThisWeek = (date) => {
    const diff =
      (today - new Date(date)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const isThisMonth = (date) => {
    const d = new Date(date);
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  /* ================= FILTERS ================= */
  const caisseJour = caisse.filter(c => isSameDay(c.createdAt));
  const caisseSemaine = caisse.filter(c => isThisWeek(c.createdAt));
  const caisseMois = caisse.filter(c => isThisMonth(c.createdAt));

  /* ================= TOTALS ================= */
  const totalEntree = (list) =>
    (list || [])
      .filter(c =>
      c.type === "ENTREE" ||
      c.type === "ACOMPTE"
    )
      .reduce((s, c) => s + Number(c.montant || 0), 0);

  const totalSortie = (list) =>
    (list || [])
      .filter(c => c.type === "SORTIE")
      .reduce((s, c) => s + Number(c.montant || 0), 0);

  const solde = totalEntree(caisse) - totalSortie(caisse);
  const soldeJour = totalEntree(caisseJour) - totalSortie(caisseJour);
  const soldeSemaine = totalEntree(caisseSemaine) - totalSortie(caisseSemaine);
  const soldeMois = totalEntree(caisseMois) - totalSortie(caisseMois);

  

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
        return true;// "TOUT"
    }

  });

};

const caisseFiltree =
  filtrerParPeriode(caisse);

  const totalGlobal = caisseFiltree.reduce((sum, c) => {

  // 🔥 SORTIES (dépenses)
  if (c.categorie === "DEPENSE") {
    return sum - Number(c.montant);
  }

  // 🔥 ENTRÉES (ventes + acomptes + paiements dettes)
  if (c.categorie === "VENTE") {
    return sum + Number(c.montant);
  }

  return sum;

}, 0);

  return (
    <div className="page-container">

      

      <div className="page-header">
        <h1> Caisse</h1>
      </div>

      {/* CARDS JOUR */}
      <div className="stats-cards">

        <div className="card entree">
          <h3>Entrées (Jour)</h3>
          <p>{totalEntree(caisseJour)} FC</p>
        </div>

        <div className="card sortie">
          <h3>Sorties (Jour)</h3>
          <p>{totalSortie(caisseJour)} FC</p>
        </div>

        <div className="card solde">
          <h3>Solde (Jour)</h3>
          <p>{soldeJour} FC</p>
        </div>

      </div>

      

      {/* TABLE */}
<div className="historique-top">
  <div className="historique-header">
    <h2>📊 Historique de la Caisse</h2>

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
        
        <table className="caisse-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Catégorie</th>
              <th>Montant</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {caisseFiltree.length > 0 ? (
              caisseFiltree.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={c.type === "ENTREE" ? "badge-entree" : "badge-sortie"}>
                      {c.type}
                    </span>
                  </td>

                  <td>{c.categorie}</td>

                  <td>{Number(c.montant).toLocaleString()} FC</td>

                  <td>{c.description}</td>

                  <td>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Aucune transaction</td>
              </tr>
            )}
          </tbody>

        </table>
        
      </div>
  

      

</div>
  );
};

export default Caisse;
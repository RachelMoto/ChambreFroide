import api from "../services/api";
import { useState, useEffect } from "react";
import { exportRapportPDF } from "../utils/exportRapport";
import "../styles/Rapports.css";

function Rapports() {

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

 const [data, setData] = useState({
  ventesComptant: [],
  ventesCredit: [],
  depenses: [],
  approvisionnements: [],
  paiements: [],

  totalComptant: 0,
  totalCredit: 0,
  totalPaiementDette: 0,
  totalDepenses: 0,
  totalEncaisse: 0,
  totalAVerser: 0,
});

  const loadReport = async () => {
  try {

    const res = await api.get(
      "/rapports?type=daily",
      config
    );

    setData(res.data);

  } catch (error) {
    console.error("Erreur rapport :", error);
  }
};

  useEffect(() => {
    loadReport();
  }, []);

  const totalGeneral = Number(data.totalEncaisse || 0);

  const totalAVerser = Number(data.totalAVerser || 0);

  const totalEncaisse =
  Number(data.totalComptant || 0) +
  Number(data.totalAcomptes || 0) +
  Number(data.totalPaiementDette || 0);

    return (
  <div className="rapport-page">
    <button
  className="btn-imprimer"
  onClick={() => exportRapportPDF(data)}
>
  🖨️ Imprimer le rapport
</button>

  <h1 className="rapport-title">
    RAPPORT JOURNALIER
  </h1>
  <div className="rapport-cards comptant">

  <div className="rapport-card">
    <h4>Ventes comptant</h4>
    <span>
      {Number(data.totalComptant || 0).toLocaleString()} FC
    </span>
  </div>

  <div className="rapport-card acompte">
    <h4>Acomptes</h4>
    <span>
      {Number(data.totalAcomptes || 0).toLocaleString()} FC
    </span>
  </div>

  <div className="rapport-card paiement">
    <h4>Paiements dettes</h4>
    <span>
      {Number(data.totalPaiementDette || 0).toLocaleString()} FC
    </span>
  </div>

  <div className="rapport-card encaisse">
    <h4>Total encaissé</h4>
    <span>
      {Number(data.totalEncaisse || 0).toLocaleString()} FC
    </span>
  </div>

  <div className="rapport-card depense">
    <h4>Dépenses</h4>
    <span>
      {Number(data.totalDepenses || 0).toLocaleString()} FC
    </span>
  </div>

  <div className="rapport-card verser">
    <h4>Total à verser</h4>
    <span>
      {Number(data.totalAVerser || 0).toLocaleString()} FC
    </span>
  </div>

</div>

  <div className="rapport-section">

    <h2>VENTES COMPTANT</h2>

    <table>

      <thead>
        <tr>
          <th>Produit</th>
          <th>Quantité</th>
          <th>Montant</th>
        </tr>
      </thead>

      <tbody>

        {data.ventesComptant?.map((vente) =>
          vente.lignes.map((ligne) => (

            <tr key={ligne.id}>

              <td>{ligne.produit.nom}</td>

              <td>{ligne.quantite}</td>

              <td>
                {(
                  Number(ligne.quantite) *
                  Number(ligne.prixUnitaire)
                ).toLocaleString()} FC
              </td>

            </tr>

          ))
        )}

      </tbody>

    </table>

    <h3>
      Total vente comptant :
      {" "}
      {Number(data.totalComptant || 0).toLocaleString()} FC
    </h3>

  </div>

  {/* ==================== */}
  {/* VENTES CREDIT */}
  {/* ==================== */}

  <div className="rapport-section">

    <h2>VENTES A CREDIT</h2>

    <table>

      <thead>
        <tr>
          <th>Produit</th>
          <th>Quantité</th>
          <th>Montant acompte</th>
        </tr>
      </thead>

      <tbody>

  {data.ventesCredit?.map((vente) => (
  <tr key={vente.id}>

    <td>
      {vente.lignes.map((ligne, index) => (
        <div key={index}>
          {ligne.produit.nom}
        </div>
      ))}
    </td>

    <td>
      {vente.lignes.map((ligne, index) => (
        <div key={index}>
          {ligne.quantite}
        </div>
      ))}
    </td>

    <td>
      {Number(vente.acompte || 0).toLocaleString()} FC
    </td>

  </tr>
))}

</tbody>

    </table>

    <h3>
  Total acomptes :
  {Number(data.totalAcomptes || 0).toLocaleString()} FC
</h3>

  </div>

  {/* ==================== */}
  {/* PAIEMENT DETTES */}
  {/* ==================== */}

  <div className="rapport-section">

  <h2>PAIEMENTS DES DETTES</h2>

  <table>

    <thead>
      <tr>
        <th>Client</th>
        <th>Montant payé</th>
      </tr>
    </thead>

    <tbody>
  {data.paiements?.map((paiement) => (
    <tr key={paiement.id}>
      <td>{paiement.client}</td>
      <td>{Number(paiement.montant).toLocaleString()} FC</td>
    </tr>
  ))}
</tbody>

<h3>
  Total paiement dette :{" "}
  {Number(data.totalPaiementDette || 0).toLocaleString()} FC
</h3>

  </table>

  

</div>

  {/* ==================== */}
  {/* DEPENSES */}
  {/* ==================== */}

  <div className="rapport-section">

    <h2>DEPENSES</h2>

    <table>

      <thead>

        <tr>
          <th>Libellé</th>
          <th>Montant</th>
        </tr>

      </thead>

      <tbody>

        {data.depenses?.map((depense) => (

          <tr key={depense.id}>

            <td>{depense.libelle}</td>

            <td>
              {Number(depense.montant).toLocaleString()} FC
            </td>

          </tr>

        ))}

      </tbody>

    </table>

    <h3>
      Total dépense :
      {" "}
      {Number(data.totalDepenses || 0).toLocaleString()} FC
    </h3>

  </div>

  {/* ==================== */}
  {/* TOTAL GENERAL */}
  {/* ==================== */}

  <div className="rapport-resume">

  <h2>RÉSUMÉ GÉNÉRAL</h2>

  <div className="resume-row">
    <span>Total ventes comptant</span>
    <strong>{data.totalComptant.toLocaleString()} FC</strong>
  </div>

  <div className="resume-row">
    <span>Total ventes crédit</span>
    <strong>{Number(data.totalAcomptes || 0).toLocaleString()} FC</strong>
  </div>

  <div className="resume-row">
    <span>Total paiements dettes</span>
    <strong>{data.totalPaiementDette.toLocaleString()} FC</strong>
  </div>

  <div className="resume-row">
    <span>Total encaissé réel</span>
    <strong>{Number(data.totalEncaisse || 0).toLocaleString()} FC</strong>
  </div>

  <div className="resume-row">
    <span>Dépenses</span>
    <strong>- {data.totalDepenses.toLocaleString()} FC</strong>
  </div>

  <hr />

  <div className="resume-row total-verser">
    <span>Total à verser</span>
    <strong>{data.totalAVerser.toLocaleString()} FC</strong>
  </div>

</div>

  {/* ==================== */}
  {/* APPROVISIONNEMENTS */}
  {/* ==================== */}

  <div className="rapport-section">

    <h2>APPROVISIONNEMENTS</h2>

    <table>

      <thead>

        <tr>
          <th>Produit</th>
          <th>Quantité</th>
        </tr>

      </thead>

      <tbody>

        {data.approvisionnements?.map((app) => (

          <tr key={app.id}>

            <td>{app.produit.nom}</td>

            <td>{app.quantite}</td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
);

}

export default Rapports;
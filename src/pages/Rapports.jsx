import axios from "axios";
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

  const [stats, setStats] = useState({
    chiffreAffaire: 0,
    benefice: 0,
    depenses: 0,
    ventes: 0,
  });

  const [data, setData] = useState({
  ventesComptant: [],
  ventesCredit: [],
  depenses: [],
  approvisionnements: [],
  paiements: [],

  totalComptant: 0,
  totalAcomptes: 0,
  totalPaiementDette: 0,
  totalDepenses: 0,
  totalAVerser: 0,
});

  const loadReport = async () => {
    try {
      console.log(token);

      const res = await axios.get(
        "http://localhost:3001/api/rapports?type=daily",
        config
      );
      console.log("REPONSE BACKEND:", res.data);


      setData(res.data);

    } catch (error) {
      console.error("Erreur rapport :", error);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const totalGeneral =
  Number(data.totalComptant || 0) +
  Number(data.totalAcomptes || 0) +
  Number(data.totalPaiementDette || 0) -
  Number(data.totalDepenses || 0);

    return (
  <div className="rapport-page">

  <h1 className="rapport-title">
    RAPPORT JOURNALIER
  </h1>

  {/* ==================== */}
  {/* VENTES COMPTANT */}
  {/* ==================== */}

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

  {data.ventesCredit?.map((vente) => {

    const dette = vente.client?.dettes?.find(
      d => Number(d.montantTotal) === Number(vente.montant)
    );

    return (

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
          {Number(dette?.montantPaye || 0).toLocaleString()} FC
        </td>

      </tr>

    );

  })}

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
    <span>Total vente comptant</span>
    <strong>
      {Number(data.totalComptant || 0).toLocaleString()} FC
    </strong>
  </div>

  <div className="resume-row">
    <span>Total acompte</span>
    <strong>
      {Number(data.totalAcomptes || 0).toLocaleString()} FC
    </strong>
  </div>

  <div className="resume-row">
    <span>Total paiement des dettes</span>
    <strong>
      {Number(data.totalPaiementDette || 0).toLocaleString()} FC
    </strong>
  </div>

  <div className="resume-row">
    <span>Total dépense</span>
    <strong>
      - {Number(data.totalDepenses || 0).toLocaleString()} FC
    </strong>
  </div>

  <hr />

  <div className="resume-row total-general">
    <span>TOTAL GÉNÉRAL</span>
    <strong>
      {totalGeneral.toLocaleString()} FC
    </strong>
  </div>

  <div className="resume-row total-verser">
    <span>TOTAL À VERSER</span>
    <strong>
      {Number(data.totalAVerser || 0).toLocaleString()} FC
    </strong>
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
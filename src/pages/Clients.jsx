import { useEffect, useState } from "react";
import { getClients } from "../services/clientService";
import { getVentes } from "../services/venteService";
import "../styles/Client.css";

function Clients() {
  const [clients, setClients] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [filtre, setFiltre] = useState("TOUS");

  useEffect(() => {
  const loadData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        getClients(),
        getVentes()
      ]);

      setClients(cRes.data);
      setVentes(pRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  loadData();
}, []);

  const today = new Date();

const enrichClients = clients.map((client) => {

  const achats30Jours = ventes.filter((vente) => {

  if (!client.telephone) {
    return false;
  }

  if (
    vente.client?.telephone !== client.telephone
  ) {
    return false;
  }

  const diff =
    (today - new Date(vente.createdAt)) /
    (1000 * 60 * 60 * 24);

  return diff <= 30;
});

  const nombreAchats = achats30Jours.length;

  let statut = "Relance";

  if (nombreAchats >= 10) {
    statut = "Actif";
  } else if (nombreAchats >= 5) {
    statut = "Moyen";
  }
  console.log(
  client.prenom,
  client.telephone,
  nombreAchats,
  statut
);

  return {
    ...client,
    totalAchats: nombreAchats,
    statut,
  };
});

const clientsActifs = enrichClients.filter(
  (client) => client.statut === "Actif"
);

const clientsMoyen = enrichClients.filter(
  (client) => client.statut === "Moyen"
);

const clientsRelance = enrichClients.filter(
  (client) => client.statut === "Relance"
);
console.log("enrichClients", enrichClients);
const clientsAffiches =
  filtre === "TOUS"
    ? enrichClients
    : enrichClients.filter(
        (client) => client.statut === filtre
      );

  return (
    <div className="page-container">

      {/* Header */}
      <div className="clients-header">
        <h1>Clients</h1>
        <p>Suivez vos clients et leur niveau de fidélité</p>
      </div>

      {/* Statistiques */}
      <div className="stats-cards">

  <div className="card actif" onClick={() => setFiltre("Actif")}>
  <h3>Clients actifs</h3>
  <span>{clientsActifs.length}</span>
</div>

<div className="card moyen"  onClick={() => setFiltre("Moyen")}>
  <h3>Clients moins actifs</h3>
  <span>{clientsMoyen.length}</span>
</div>

<div className="card relance" onClick={() => setFiltre("Relance")}>
  <h3>Clients à relancer</h3>
  <span>{clientsRelance.length}</span>
</div>

<div className="card tous" onClick={() => setFiltre("TOUS")}>
  <h3>Tous les clients</h3>
  <span>{clients.length}</span>
</div>

</div>

   <div className="client-section">
      <div className="client-header">
        <h2>Liste des clients</h2>
        <p>Tous les clients enregistrés</p>
      </div>

      {/* Tableau */}
 <table className="client-table">

  <thead>
  <tr>
    <th>Prénom</th>
    <th>Téléphone</th>
    <th>Statut</th>
    <th>Achats (30 jours)</th>
  </tr>
</thead>

        <tbody>
  {enrichClients.length > 0 ? (
    clientsAffiches.map((client) => (
      <tr key={client.id}>
        <td>{client.prenom}</td>

        <td>{client.telephone}</td>

        <td>
  <span className={`statut-${client.statut.toLowerCase()}`}>
    {client.statut}
  </span>
</td>

        <td>{client.totalAchats}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4">
        Aucun client trouvé
      </td>
    </tr>
  )}
</tbody>

      </table>

  </div>

</div>
  );
}

export default Clients;
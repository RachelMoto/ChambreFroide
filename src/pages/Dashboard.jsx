import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FaMoneyBillWave,
  FaCalendarWeek,
  FaCalendarAlt,
  FaBoxOpen,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "../styles/Dashboard.css";

function Dashboard() {
  const [ventes, setVentes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalTotal, setModalTotal] = useState(0);

  useEffect(() => {
    loadVentes();
    loadProduits();
  }, []);

  const loadVentes = async () => {
    try {
      const res = await api.get(
        "/ventes"
      );

      setVentes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadProduits = async () => {
    try {
      const res = await api.get(
        "/produits"
      );

      setProduits(
  res.data.filter((p) => p.actif)
);
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date();

  const ventesJour = ventes.filter(
    (v) =>
      new Date(v.createdAt).toDateString() ===
      today.toDateString()
  );

  const ventesSemaine = ventes.filter((v) => {
    const diff =
      (today - new Date(v.createdAt)) /
      (1000 * 60 * 60 * 24);

    return diff <= 7;
  });

  const ventesMois = ventes.filter((v) => {
    const date = new Date(v.createdAt);

    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() ===
        today.getFullYear()
    );
  });

  const calculerEncaisse = (liste) => {
  return liste.reduce((sum, vente) => {

    const type = String(vente.type || "").toUpperCase().trim();

    // 💵 COMPTANT
    if (type === "COMPTANT") {
      return sum + Number(vente.montant || 0);
    }

    // 💳 CREDIT → on prend acompte
    const dette = vente.client?.dettes?.find(
      d => Number(d.montantTotal) === Number(vente.montant)
    );

    return sum + Number(dette?.montantPaye || 0);

  }, 0);
};

const totalJour = calculerEncaisse(ventesJour);
const totalSemaine = calculerEncaisse(ventesSemaine);
const totalMois = calculerEncaisse(ventesMois);

const openVentesModal = (titre, listeVentes) => {

  const ventesComptant = [];
  const ventesCreditMap = new Map();

  let totalComptant = 0;
  let totalAcomptes = 0;

  listeVentes.forEach((vente) => {

    const type = String(vente.type || "").toUpperCase().trim();

    vente.lignes?.forEach((ligne) => {

      const montant =
        Number(ligne.quantite || 0) *
        Number(ligne.prixUnitaire || 0);

      // ================= COMPTANT =================
      if (type === "COMPTANT") {

        ventesComptant.push({
          nom: ligne.produit?.nom,
          quantite: ligne.quantite,
          montant,
        });

        totalComptant += montant;
      }

      // ================= CREDIT =================
      else if (type === "CREDIT") {

        const dette = vente.client?.dettes?.find(
          d => d.statut === "EN_COURS" || d.statut === "PAYEE"
        );

        const acompte = Number(dette?.montantPaye || 0);

        const key = vente.id;

        if (!ventesCreditMap.has(key)) {
          ventesCreditMap.set(key, {
            id: vente.id,
            acompte,
            produits: [],
          });

          totalAcomptes += acompte;
        }

        ventesCreditMap.get(key).produits.push({
          nom: ligne.produit?.nom,
          quantite: Number(ligne.quantite || 0),
        });
      }

    });

  });

  const ventesCredit = Array.from(ventesCreditMap.values());

  setModalTitle(titre);
  setModalData({
    ventesComptant,
    ventesCredit,
    totalComptant,
    totalAcomptes,
  });

  setShowModal(true);
};

  
  


const openProduitsModal = () => {

  setModalTitle("Produits enregistrés");

  setModalData(produits);

  setModalTotal(produits.length);

  setShowModal(true);

};

const buildProductStats = (listeVentes) => {

  const stats = {};

  listeVentes.forEach((vente) => {

    vente.lignes?.forEach((ligne) => {

      const nom = ligne.produit.nom;

      const montant =
        Number(ligne.quantite) *
        Number(ligne.prixUnitaire);

      if (!stats[nom]) {

        stats[nom] = {
          nom,
          quantite: 0,
          total: 0,
        };

      }

      stats[nom].quantite += Number(ligne.quantite);

      stats[nom].total += montant;

    });

  });

  return Object.values(stats);

};

const dataSemaine = buildProductStats(ventesSemaine);

const dataMois = buildProductStats(ventesMois);



  return (
<div className="dashboard-container">

  <div className="dashboard-header">
    <h1>Dashboard</h1>
    <p>Bienvenue sur le tableau de bord de Coref Froid</p>
  </div>

  <div className="dashboard-cards">

    {/* VENTES JOUR */}
    <div
      className="dashboard-card"
      onClick={() =>
        openVentesModal(
          "Détail des ventes du jour",
          ventesJour
        )
      }
    >
      <div className="card-icon">
        <FaMoneyBillWave />
      </div>

      <div>
        <h3>Ventes du jour</h3>
        <p>{totalJour.toLocaleString()} FC</p>
      </div>
    </div>

    {/* VENTES SEMAINE */}
    <div
      className="dashboard-card"
      onClick={() =>
        openVentesModal(
          "Détail des ventes de la semaine",
          ventesSemaine
        )
      }
    >
      <div className="card-icon">
        <FaCalendarWeek />
      </div>

      <div>
        <h3>Ventes semaine</h3>
        <p>{totalSemaine.toLocaleString()} FC</p>
      </div>
    </div>

    {/* VENTES MOIS */}
    <div
      className="dashboard-card"
      onClick={() =>
        openVentesModal(
          "Détail des ventes du mois",
          ventesMois
        )
      }
    >
      <div className="card-icon">
        <FaCalendarAlt />
      </div>

      <div>
        <h3>Ventes du mois</h3>
        <p>{totalMois.toLocaleString()} FC</p>
      </div>
    </div>

    {/* PRODUITS */}
    <div
      className="dashboard-card"
      onClick={openProduitsModal}
    >
      <div className="card-icon">
        <FaBoxOpen />
      </div>

      <div>
        <h3>Produits enregistrés</h3>
        <p>{produits.length}</p>
      </div>
    </div>

  </div>


      {showModal && (
  <div className="modal-overlay">

    <div className="modal-content">

      <h2>{modalTitle}</h2>

      {/* ================= PRODUITS ================= */}
      {modalTitle === "Produits enregistrés" ? (

        <>
          {modalData.map((produit) => (

            <div
              key={produit.id}
              className="detail-row"
            >
              <span>{produit.nom}</span>

              <strong>
                {produit.quantite} unité(s)
              </strong>

            </div>

          ))}

          <hr />

          <div className="detail-total">
            <span>Total produits</span>

            <strong>
              {modalTotal}
            </strong>
          </div>

        </>

      ) : (

        <>
          {/* ================= VENTES COMPTANT ================= */}

          <h3>💵 Ventes comptant</h3>

          {modalData.ventesComptant?.length > 0 ? (

            modalData.ventesComptant.map((item, index) => (

              <div
                key={index}
                className="detail-row"
              >
                <span>
                  {item.nom} × {item.quantite}
                </span>

                <strong>
                  {Number(item.montant).toLocaleString()} FC
                </strong>

              </div>

            ))

          ) : (

            <p>Aucune vente comptant</p>

          )}

          <div className="detail-total">
            <span>Total comptant</span>

            <strong>
              {Number(
                modalData.totalComptant || 0
              ).toLocaleString()} FC
            </strong>
          </div>

          <hr />

          {/* ================= VENTES CREDIT ================= */}

          <h3>💳 Ventes crédit (Acomptes)</h3>

{modalData.ventesCredit?.length > 0 ? (

  modalData.ventesCredit.map((vente, index) => (

    <div key={index} className="credit-block">

      {vente.produits.map((p, i) => (
        <div key={i} className="detail-row">
          <span>{p.nom} × {p.quantite}</span>
        </div>
      ))}

      <div className="detail-total">
        <strong>
          Acompte : {Number(vente.acompte).toLocaleString()} FC
        </strong>
      </div>

      <hr />

    </div>

  ))

) : (
  <p>Aucune vente crédit</p>
)}

<div className="detail-total">
  <span>Total acomptes</span>
  <strong>
    {Number(modalData.totalAcomptes || 0).toLocaleString()} FC
  </strong>
</div>


          <hr />

          {/* ================= TOTAL GENERAL ================= */}

          <div className="detail-total grand-total">

            <span>Total encaissé</span>

            <strong>

              {Number(
                (modalData.totalComptant || 0) +
                (modalData.totalAcomptes || 0)
              ).toLocaleString()} FC

            </strong>

          </div>

        </>

      )}

      <button
        onClick={() => setShowModal(false)}
      >
        Fermer
      </button>

    </div>

  </div>
)}

<div className="dashboard-charts">

  {/* ================= SEMAINE ================= */}

  <div className="chart-container">

    <h2>📊 Produits les plus vendus (Semaine)</h2>

    <ResponsiveContainer width="100%" height={350}>

      <BarChart
        data={dataSemaine}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >

        <CartesianGrid
          strokeDasharray="4 4"
        />

        <XAxis
          dataKey="nom"
          angle={-15}
          textAnchor="end"
        />

        <YAxis />

        <Tooltip
          formatter={(value) =>
            `${Number(value).toLocaleString()} FC`
          }
        />

        <Legend />

        <Bar
          dataKey="total"
          name="Montant vendu"
          fill="#2563eb"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  {/* ================= MOIS ================= */}

  <div className="chart-container">

    <h2>📈 Produits les plus vendus (Mois)</h2>

    <ResponsiveContainer width="100%" height={350}>

      <BarChart
        data={dataMois}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 20,
        }}
      >

        <CartesianGrid
          strokeDasharray="4 4"
        />

        <XAxis
          dataKey="nom"
          angle={-15}
          textAnchor="end"
        />

        <YAxis />

        <Tooltip
          formatter={(value) =>
            `${Number(value).toLocaleString()} FC`
          }
        />

        <Legend />

        <Bar
          dataKey="total"
          name="Montant vendu"
          fill="#16a34a"
          radius={[8, 8, 0, 0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

</div>

</div>
  );
}

export default Dashboard;
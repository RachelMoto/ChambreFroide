import { useEffect, useState } from "react";
import {
  getDepenses,
  createDepense,
} from "../services/depenseService";
import "../styles/Depense.css";

function Depense() {
  const [depenses, setDepenses] = useState([]);

  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  

  useEffect(() => {
    loadDepenses();
  }, []);

  const loadDepenses = async () => {
    try {
      const res = await getDepenses();
      setDepenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDepense = async () => {
    try {
      if (!libelle || !montant) {
        alert("Champs obligatoires");
        return;
      }

      await createDepense({
        libelle,
        montant,
        categorie,
        description,
      });

      setLibelle("");
      setMontant("");
      setCategorie("");
      setDescription("");

      loadDepenses();
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date();

// 🔥 JOUR
const depensesJour = depenses.filter(d =>
  new Date(d.createdAt).toDateString() === today.toDateString()
);

// 🔥 SEMAINE
const depensesSemaine = depenses.filter(d => {
  const diff =
    (today - new Date(d.createdAt)) /
    (1000 * 60 * 60 * 24);

  return diff <= 7;
});

// 🔥 MOIS
const depensesMois = depenses.filter(d =>
  new Date(d.createdAt).getMonth() ===
  today.getMonth()
);

const calculTotal = (list) =>
  list.reduce(
    (sum, item) =>
      sum + Number(item.montant),
    0
  );

  const totalDepenses = calculTotal(depenses);

  const totalJour = calculTotal(depensesJour);

  const totalSemaine = calculTotal(depensesSemaine);

  const totalMois = calculTotal(depensesMois);

  return (
    <div className="depense-container">
      <div className="depense-header">
         <h1>Dépenses</h1>
         <p>Suivez l'évolution des depenses effectuées</p>
      </div>

        <div className="stats-cards">

           <div className="card jour">
             <h3>Dépenses du jour</h3>
             <p>{totalJour} FC</p>
           </div>

           <div className="card semaine">
             <h3>Dépenses semaine</h3>
             <p>{totalSemaine} FC</p>
           </div>

           <div className="card mois">
             <h3>Dépenses mois</h3>
             <p>{totalMois} FC</p>
           </div>

           <div className="depense-total">
              Total général : {totalDepenses} FC
           </div>

        </div>

      

      
      <div className="depense-form">

        <input
          type="text"
          placeholder="Libellé"
          value={libelle}
          onChange={(e) =>
            setLibelle(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) =>
            setMontant(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Catégorie"
          value={categorie}
          onChange={(e) =>
            setCategorie(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          onClick={handleAddDepense}
        >
          Ajouter dépense
        </button>

      </div>

      

    <div className="depense-section">
      <h2>📊 Historique des depenses</h2>
      <table className="depense-table">
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Catégorie</th>
            <th>Description</th>
            <th>Montant</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {depenses.map((d) => (
            <tr key={d.id}>
              <td>{d.libelle}</td>
              <td>{d.categorie}</td>
              <td>{d.description}</td>
              <td>{d.montant} FC</td>
              <td>
                {new Date(
                  d.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>

    </div>
  );
}

export default Depense;
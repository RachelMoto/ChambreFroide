import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3001/api/auth/change-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Mot de passe modifié avec succès");

      navigate("/login");

    } catch (err) {
      console.log(err);
      alert("Erreur lors de la modification");
    }
  };

  return (
    <div className="reset-container">

      <div className="reset-box">

        <h2>🔐 Nouveau mot de passe</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="Entrer le nouveau mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Valider
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;
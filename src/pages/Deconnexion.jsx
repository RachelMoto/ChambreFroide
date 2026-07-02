import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 1. supprimer token
    localStorage.removeItem("token");

    // 🔥 2. (optionnel) supprimer user
    localStorage.removeItem("user");

    // 🔥 3. redirection login
    navigate("/login");
  }, [navigate]);

  return <p>Déconnexion en cours...</p>;
}

export default Logout;
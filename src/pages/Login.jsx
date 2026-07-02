import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "../styles/Login.css";
import logo from "../assets/Logo coref.png";
import GoogleButton from "../components/GoogleButton";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );

      const { token, user, mustChangePassword } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (mustChangePassword) {
        navigate("/reset-password");
        return;
      }

      navigate("/dashboard");

    } catch (err) {
      console.log(err);
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="login-page">

      <div className="login-box">

        {/* PARTIE GAUCHE */}
        <div className="login-left">

          <div className="logo-title">
            <img
              src={logo}
              alt="logo"
              className="logo"
            />
            <h1>Coref Froid</h1>
          </div>

          <div className="left-content">
            <h2>
              Supervision centrale des ventes,
              commandes et stocks
            </h2>

            <p>
              Connecte-toi avec un compte
              <b> ADMIN </b>,
              
              <b> SUPER ADMIN </b>,
              <b> CAISSIER </b>
              ou
              <b> COMPTABLE </b>
              pour accéder aux écrans centraux
              de gestion.
            </p>
          </div>

        </div>

        {/* PARTIE DROITE */}
        <div className="login-right">

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <h2>Connexion</h2>

            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="submit"
              className="login-btn"
            >
              Se connecter
            </button>

            <div className="divider">
              <span>OU</span>
            </div>
              <GoogleButton />

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo coref.png";
import bannière from "../assets/Bannière.png";
import cuisse from "../assets/cuisse.jpg";
import catfish from "../assets/catfish.jpg";
import tripe from "../assets/tripe.png";
import tilapia from "../assets/tilapia.jpeg";

import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const images = [bannière, catfish, tripe, tilapia];

  const [index, setIndex] = useState(0);

  // changement automatique du background
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // change toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${images[index]})`,
      }}
    >
      <div className="overlay">
         <div className="home-top">
          <img src={logo} alt="logo" className="home-logo" />
          <h2 className="home-title">Coref Froid</h2>
        </div>
        <div className="home-content">

          <h1>
            Bienvenue sur la plateforme de gestion
            de la chambre froide
          </h1>

          <p>
            Gérez les ventes, les stocks, les clients,
            les dettes et les approvisionnements.
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Accéder à la plateforme
          </button>

        </div>
      </div>
    </div>
  );
}

export default Home;
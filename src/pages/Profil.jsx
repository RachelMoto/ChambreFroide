import { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../assets/Profile-removebg.png";
import "../styles/Profil.css";

function Profil() {

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const updateProfileImage = async () => {

    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.put(
      "http://localhost:3001/api/users/profile-image",
      formData,
      {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Photo mise à jour");

    setUser(res.data.user);

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="profil-container">

      <h2>Mon Profil</h2>

      <div className="profil-card">

        <div className="profil-image">

          <img
  src={
    user?.imageUrl ||
    `https://ui-avatars.com/api/?name=${user.nom}&background=0D47A1&color=fff`
  }
  alt="Profil"
  className="profile-avatar"
/>

          <input
            type="file"
            onChange={handleImageChange}
          />

          <button onClick={updateProfileImage}>
            Mettre à jour la photo
          </button>

        </div>

        <div className="profil-info">

          <p><b>Nom :</b> {user.nom}</p>
          <p><b>Username :</b> {user.username}</p>
          <p><b>Email :</b> {user.email}</p>
          <p><b>Téléphone :</b> {user.telephone}</p>
          <p><b>Rôle :</b> {user.role}</p>

        </div>

      </div>

    </div>
  );
}

export default Profil;
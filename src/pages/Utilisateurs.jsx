import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Utilisateur.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

function Utilisateurs() {

  const [telephone, setTelephone] = useState("");

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    nom: "",
    telephone: "",
    role: "CAISSIER",
    password: "",
    googleEnabled: false,
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchUsers = async () => {
    const res = await api.get(
      "/users",
      config
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem("token"));
    console.log(JSON.parse(localStorage.getItem("user")));
    console.log("Données envoyées :", form);

    await api.post(
      "/users",
      form,
      config
    );

    setForm({
      username: "",
      email: "",
      nom: "",
      telephone: "",
      role: "CAISSIER",
      password: "",
      googleEnabled: false,
    });

    fetchUsers();
  };

  const disableUser = async (id) => {
    await api.put(
      `/users/disable/${id}`,
      {},
      config
    );
    fetchUsers();
  };

  const enableUser = async (id) => {
    await api.put(
      `/users/enable/${id}`,
      {},
      config
    );
    fetchUsers();
  };

  const resetPassword = async (id) => {
    const ok = window.confirm(
    "Réinitialiser le mot de passe à 'admin123' ?"
  );

  if (!ok) return;
  
    await api.put(
      `/users/reset-password/${id}`,
      {},
      config
    );
    alert("Mot de passe réinitialisé à admin123");
  };

  const deleteUser = async (id) => {
    await api.delete(
      `/users/${id}`,
      config
    );
    fetchUsers();
  };

  return (
  <div className="users-container">

    <h2 className="users-title">
      Gestion des utilisateurs
    </h2>

    {/* FORMULAIRE */}
    <form
      className="users-form"
      onSubmit={handleCreate}
    >

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="nom"
        placeholder="Nom"
        value={form.nom}
        onChange={handleChange}
        required
      />

      <PhoneInput
  defaultCountry="cd"
  value={telephone}
  onChange={(phone) => setTelephone(phone)}
  inputProps={{
    placeholder: "Téléphone",
  }}
  
/>

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        <option value="ADMIN">ADMIN</option>
        <option value="CAISSIER">CAISSIER</option>
        <option value="COMPTABLE">COMPTABLE</option>
      </select>

      <input
        name="password"
        type="password"
        placeholder="Mot de passe"
        value={form.password}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          checked={form.googleEnabled}
          onChange={(e) =>
            setForm({
              ...form,
              googleEnabled: e.target.checked,
            })
          }
        />
        Google activé
      </label>

      <button type="submit">
        Créer utilisateur
      </button>

    </form>

    {/* LISTE */}
    <div className="users-list">

      {users.map((u) => (
        <div key={u.id} className="user-card">

          <div className="user-info">
            <p><b>{u.nom}</b></p>
            <p>{u.username}</p>
            <p>{u.role}</p>
            <p>{u.actif ? "Actif" : "Bloqué"}</p>
          </div>

          <div className="user-actions">

            <button type ="button"
              className="btn-disable"
              onClick={() => disableUser(u.id)}
            >
              Désactiver
            </button>

            <button type="button"
              className="btn-enable"
              onClick={() => enableUser(u.id)}
            >
              Activer
            </button>

            <button type="button"
              className="btn-reset"
              onClick={() => resetPassword(u.id)}
            >
              Reset
            </button>

            <button type="button"
              className="btn-delete"
              onClick={() => deleteUser(u.id)}
            >
              Supprimer
            </button>

          </div>

        </div>
      ))}

    </div>

  </div>
);
}

export default Utilisateurs;
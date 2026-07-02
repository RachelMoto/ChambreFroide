import { Routes, Route } from 'react-router-dom';
import { useState } from "react";
import "./styles/layout.css";
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Caisse from './pages/Caisse';
import Produits from './pages/Produits';
import Clients from './pages/Clients';
import Vente from './Pages/Vente';
import Commandes from './pages/Commandes';
import Paiements from './pages/Paiements';
import Dettes from './pages/Dette';
import Approvisionnement from './pages/approvisionnement';
import Depense from './pages/Depense';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Utilisateurs from './pages/Utilisateurs';
import Profil from './pages/Profil';
import Notifications from './pages/Notifications';
import Messages from './pages/Message';
import Rapports from './pages/Rapports';
import Logout from './pages/Deconnexion';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>
<div className='main-content'>
   <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />}/>
      <Route path="/" element={<Home />} />

    <Route element={<Layout />}>
      <Route path="/Dashboard" element = { <Dashboard />} />
      <Route path="/caisse" element = { <Caisse />} />
      
      <Route path="/produits" element = { <Produits />} />
      <Route path="/clients" element = { <Clients />} />
      <Route path="/vente" element = { <Vente />} />
      <Route path="/commandes" element = { <Commandes />} />
      <Route path="/paiements" element = { <Paiements />} />
      <Route path="/dettes-clients" element = { <Dettes />} />
      <Route path="/approvisionnement" element = { <Approvisionnement />} />
      <Route path="/depenses" element = { <Depense />} />
      <Route path="/utilisateurs" element = { <Utilisateurs />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/rapports" element={<Rapports />} />
      <Route path="/logout" element={<Logout />} />
    </Route>
      

      
        
  </Routes>

</div>
    </>
  )
}

export default App;
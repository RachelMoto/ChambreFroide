import {
  FaHome,
  FaBox,
  FaCashRegister,
  FaMoneyBillWave,
  FaUsers,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaTruckLoading,
  FaHandHoldingUsd,
  FaChartBar,
  FaUsersCog,
  FaHeadset,
  FaCog,
  FaReceipt,
} from "react-icons/fa";

import { PERMISSIONS } from "./permissions";

export const MENU = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Produits",
    path: "/produits",
    icon: FaBox,
    permission: PERMISSIONS.PRODUIT_VIEW,
  },
  {
    label: "Vente",
    path: "/vente",
    icon: FaCashRegister,
    permission: PERMISSIONS.VENTE_VIEW,
  },
  {
    label: "Caisse",
    path: "/caisse",
    icon: FaMoneyBillWave,
    permission: PERMISSIONS.CAISSE_VIEW,
  },
  {
    label: "Clients",
    path: "/clients",
    icon: FaUsers,
    permission: PERMISSIONS.CLIENT_VIEW,
  },


  {
    label: "Commandes",
    path: "/commandes",
    icon: FaShoppingCart,
    permission: PERMISSIONS.COMMANDE_VIEW,
  },

  {
    label: "Paiements",
    path: "/paiements",
    icon: FaReceipt,
    permission: PERMISSIONS.PAIEMENT_VIEW,
  },

  {
    label: "Dettes",
    path: "/dettes-clients",
    icon: FaMoneyCheckAlt,
    permission: PERMISSIONS.DETTE_VIEW,
  },

  {
    label: "Approvisionnement",
    path: "/approvisionnement",
    icon:  FaTruckLoading,
    permission: PERMISSIONS.APPROVISIONNEMENT_VIEW,
  },

  {
    label: "Dépenses",
    path: "/depenses",
    icon: FaHandHoldingUsd,
    permission: PERMISSIONS.DEPENSE_VIEW,
  },

  {
    label: "Rapports",
    path: "/rapports",
    icon: FaChartBar,
    permission: PERMISSIONS.RAPPORT_VIEW,
  },

  {
    label: "Utilisateurs",
    path: "/utilisateurs",
    icon: FaUsersCog,
    permission: PERMISSIONS.USER_MANAGE,
  },
];
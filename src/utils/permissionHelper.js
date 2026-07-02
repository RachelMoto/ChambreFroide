import { ROLE_PERMISSIONS } from "../config/permissions";
import { PERMISSIONS } from "../config/permissions";

/**
 * Vérifie si un utilisateur a une permission donnée
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  // SUPER_ADMIN ou ADMIN avec "*"
  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(permission);
};

/**
 * Vérifie si un utilisateur a accès à un module complet
 * (utile pour Sidebar / pages)
 */
export const hasAccess = (user, modulePermissions = []) => {
  if (!user) return false;

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  if (permissions.includes("*")) {
    return true;
  }

  return modulePermissions.some((p) =>
    permissions.includes(p)
  );
};

/**
 * Récupère toutes les permissions d'un utilisateur
 */
export const getUserPermissions = (user) => {
  if (!user) return [];

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  if (permissions.includes("*")) {
    return Object.values(PERMISSIONS);
  }

  return permissions;
};
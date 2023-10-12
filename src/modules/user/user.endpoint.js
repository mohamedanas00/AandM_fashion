import { roles } from "../../middleware/auth.js";

export const userAuth = {
  adminRole: [roles.admin],
  userRole: [roles.admin],
  Roles: [roles.admin, roles.user],
};

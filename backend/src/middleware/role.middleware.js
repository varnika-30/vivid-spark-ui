/**
 * Role-Based Authorization Middleware Factory
 * Maps role aliases to exact database user roles ('client', 'driver', 'manager').
 * 
 * Usage examples:
 *   authorize('manager')
 *   authorize('FLEET_MANAGER', 'DRIVER')
 *   authorize('client', 'driver')
 * 
 * @param {...string} allowedRoles - Permitted user roles
 * @returns {Function} Express middleware function
 */
export const authorize = (...allowedRoles) => {
  const roleAliasMap = {
    'FLEET_MANAGER': 'manager',
    'MANAGER': 'manager',
    'CLIENT': 'client',
    'DRIVER': 'driver',
  };

  const normalizedAllowedRoles = allowedRoles.map((role) => {
    const upper = String(role).toUpperCase();
    return roleAliasMap[upper] || String(role).toLowerCase();
  });

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to role authorization',
      });
    }

    const userRole = String(req.user.role).toLowerCase();

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to access this resource',
      });
    }

    next();
  };
};

export default authorize;

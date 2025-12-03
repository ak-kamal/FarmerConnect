// Middleware for Role-Based Access Control (RBAC)
// This function checks if the authenticated user's role is included in the list of allowed roles.

/**
 * Factory function to create role checking middleware.
 * @param {Array<string>} roles - An array of roles (e.g., ['admin', 'farmer']) that are allowed to access the route.
 */
const checkRole = (roles) => (req, res, next) => {
  // 1. Check if the user object was attached by the preceding authentication middleware.
  // If req.user is missing, it means auth middleware failed or wasn't run first,
  // but for safety, we check anyway.
  if (!req.user || !req.user.role) {
    // If we reach here, it usually means the auth middleware failed, but we send a simple
    // forbidden error as a safety measure.
    return res.status(403).json({
      message: 'Access denied. You are not authenticated.',
    });
  }

  // 2. Convert the user's role to lowercase for reliable comparison
  const userRole = req.user.role.toLowerCase();

  // 3. Check if the user's role is included in the list of allowed roles
  if (roles.includes(userRole)) {
    // Role is allowed, proceed to the next middleware or controller
    next();
  } else {
    // Role is not authorized to access this resource
    return res.status(403).json({
      message: `Access denied. Role "${req.user.role}" is not authorized for this resource.`,
    });
  }
};

module.exports = {
  checkRole,
};
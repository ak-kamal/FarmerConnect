// server/middleware/rbacMiddleware.js

/**
 * Factory function to create role checking middleware.
 * @param {Array<string>} roles - An array of roles (e.g., ['admin', 'farmer']) that are allowed to access the route.
 */
export const checkRole = (roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({
      message: "Access denied. You are not authenticated.",
    });
  }

  const userRole = req.user.role.toLowerCase();

  if (roles.includes(userRole)) {
    return next();
  }

  return res.status(403).json({
    message: `Access denied. Role "${req.user.role}" is not authorized for this resource.`,
  });
};

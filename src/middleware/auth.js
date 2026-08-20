import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("No token"));
  }
  try {
    const token = auth.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, email }
    next();
  } catch {
    res.status(401);
    next(new Error("Invalid token"));
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    return next(new Error("Admin only"));
  }
  next();
}

export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  } catch (err) {
    console.error("isAdmin error:", err);
    return res.status(500).json({ message: "Server error in isAdmin" });
  }
};
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: true, message: "invalid token" });
    req._id = decoded._id;
    req.name = decoded.name;
    next();
  });
};

export const withRefreshToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const isUserLoggedIn = await UserToken.findOne({ token });
  if (!isUserLoggedIn) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: true, message: "invalid token" });
    req._id = decoded._id;
    req.name = decoded.name;
    req.role = decoded.role;
    req.token = token;
    next();
  });
};

export const isSuperAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired")
        return res.status(401).json({ error: true, message: "invalid token" });
      return res.status(403).json({ error: true, message: "invalid token" });
    }
    if (decoded.role !== "super_admin")
      return res
        .status(403)
        .json({ error: true, message: "You don't have permission" });
    req._id = decoded._id;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired")
        return res.status(401).json({ error: true, message: "invalid token" });
      return res.status(403).json({ error: true, message: "invalid token" });
    }
    if (decoded.role === "agent")
      return res
        .status(403)
        .json({ error: true, message: "You don't have permission" });
    req._id = decoded._id;
    next();
  });
};

export const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.message === "jwt expired")
        return res.status(401).json({ error: true, message: "invalid token" });
      return res.status(403).json({ error: true, message: "invalid token" });
    }
    req._id = decoded._id;
    req.role = decoded.role;
    next();
  });
};

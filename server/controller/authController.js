import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import generateTokens from "./../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

export const whoAmI = async (req, res) => {
  try {
    const { _id, name, role } = req;
    const user = await UserModel.findOne({ _id });
    const payload = { _id, name, role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "15m",
    });
    return res.status(200).json({
      error: false,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(400).json({
        error: true,
        message: "You most send email and password!",
      });

    const user = await UserModel.findOne({ email: email });
    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const verifiedPassword = await bcrypt.compare(password, user.password);
    if (!verifiedPassword)
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });

    const { accessToken, refreshToken } = await generateTokens(user);
    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      role: user.role,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ error: true, message: "invalid token" });
        return decoded;
      }
    );
    const user = await UserModel.findOne({ _id: decoded._id });
    if (!user)
      return res
        .status(400)
        .json({ error: true, message: "This account does not exist." });

    const userToken = await UserToken.findOne({ userId: user._id });

    if (refreshToken !== userToken.token)
      return res
        .status(400)
        .json({ error: true, message: "Please login now!" });

    const payload = { _id: user._id, name: user.name, role: user.role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "15m",
    });
    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

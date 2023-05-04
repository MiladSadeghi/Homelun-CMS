import AgentModel from "../models/AgentModel.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import UserToken from "../models/UserToken.js";

export const createNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    res.status(400).json({
      error: true,
      message: "invalid data",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = {
    createdBy: req._id,
    email,
    name,
    password: hashedPassword,
    role,
  };

  try {
    const createdUser = await UserModel.create(data);
    if (role === "agent")
      await AgentModel.create({
        user: createdUser._id,
        slug: createdUser.name.toLowerCase().replace(/ /g, "-"),
      });
    return res
      .status(200)
      .json({ error: false, message: "User created", user: createdUser });
  } catch (err) {
    if (err.code === 11000 || err.code === 11001) {
      return res.status(409).json({
        error: false,
        message: `${Object.keys(err.keyValue).join("")} already exists`,
      });
    } else {
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  }
};

export const getUsers = async (req, res) => {
  const { _id } = req;
  try {
    let users = await UserModel.find({ _id: { $ne: _id } })
      .populate({ path: "createdBy", select: "name" })
      .select("-password");

    return res.status(200).json({
      error: false,
      users,
    });
  } catch (error) {}
};

export const disableUser = async (req, res) => {
  try {
    const { userId, disabled } = req.body;
    if (!userId || typeof disabled !== "boolean")
      return res
        .status(400)
        .json({ error: true, message: "Select a user first" });

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: { disabled } }
    );
    if (!user)
      return res.status(404).json({ error: true, message: "User not exist!" });

    return res.status(200).json({
      error: false,
      message: "User login has been disabled.",
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const userLogout = async (req, res) => {
  try {
    const { _id } = req;
    await UserToken.findOneAndDelete({ userId: _id });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

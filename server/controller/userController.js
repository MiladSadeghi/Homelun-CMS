import AgentModel from "../models/AgentModel.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import UserToken from "../models/UserToken.js";

export const createNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({
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
    if (role === "agent") {
      await AgentModel.create({
        user: createdUser._id,
        name: createdUser.name,
        slug: createdUser.name.toLowerCase().replace(/ /g, "-"),
      });
    }
    return res.status(200).json({
      error: false,
      message: "User created successfully",
      user: createdUser,
    });
  } catch (err) {
    if (err.code === 11000 || err.code === 11001) {
      return res.status(409).json({
        error: false,
        message: `${Object.keys(err.keyValue).join("")} already exists`,
      });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
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

export const getUserWithId = async (req, res) => {
  const { userId } = req.params;
  if (!userId)
    return res
      .status(400)
      .json({ error: true, message: "send user id please!" });

  try {
    const findUser = await UserModel.findById(userId);
    if (!findUser)
      return res
        .status(404)
        .json({ error: true, message: "cant find the user" });

    return res.status(200).json({ error: false, user: findUser });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const updateUserWithId = async (req, res) => {
  const { userId } = req.params;
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object)
    return res
      .status(400)
      .json({ error: true, message: "at least change something" });

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (req.body.role === "agent") {
      const findAgent = await AgentModel.findOne({ user: updatedUser._id });
      if (!findAgent) {
        await AgentModel.create({
          user: updatedUser._id,
          slug: updatedUser.name.toLowerCase().replace(/ /g, "-"),
          name: updatedUser.name,
        });
      }
    }
    return res
      .status(200)
      .json({ error: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

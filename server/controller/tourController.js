import mongoose from "mongoose";
import TourModel from "../models/TourRequestModel.js";

export const getTourRequests = async (req, res) => {
  const { agentId } = req.params;
  try {
    const foundedTourRequests = await TourModel.find({
      ...(agentId && { agent: new mongoose.Types.ObjectId(agentId) }),
    })
      .populate({ path: "agent" })
      .populate({ path: "property" });
    if (!foundedTourRequests) {
      return res.status(408).json({ error: true, message: "Refresh the page" });
    }
    return res.status(200).json({ error: false, tours: foundedTourRequests });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

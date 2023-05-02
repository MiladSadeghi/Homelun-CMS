import AgentModel from "../models/AgentModel.js";

export const getAgentProfile = async (req, res) => {
  try {
    const { _id } = req;
    const getAgentProfile = await AgentModel.findOne({ user: _id });
    const validationError = await getAgentProfile.validateSync();
    if (validationError) {
      return res
        .status(422)
        .json({ error: true, message: "please complete your profile!" });
    }
    return res.status(200).json({ error: false, profile: getAgentProfile });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const updateAgentProfile = async (req, res) => {
  try {
    const { _id } = req;
    const { name, field, phoneNumber, about, cover } = req.body;
    if (!name || !field || !phoneNumber || !about || !cover)
      return res
        .status(400)
        .json({ error: true, message: "please fill all field" });

    const updatedAgent = await AgentModel.findOneAndUpdate(
      { user: _id },
      { name, field, phoneNumber, about, cover, publish: true },
      { new: true }
    );
    const validationError = await updatedAgent.validateSync();
    if (validationError) {
      return res
        .status(422)
        .json({ error: true, message: "please complete your profile!" });
    }
    return res
      .status(200)
      .json({ error: false, message: "profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getAgent = async (req, res) => {
  const user = req.params.id;

  try {
    const findAgents = user
      ? await AgentModel.find({ "&and": [{ user, publish: true }] })
      : await AgentModel.find({ publish: true });
    if (!findAgents)
      return res
        .status(404)
        .json({ error: true, message: "cant find agents or agent!" });
    return res.status(200).json({ error: false, agents: findAgents });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

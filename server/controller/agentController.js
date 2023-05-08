import AgentModel from "../models/AgentModel.js";
import PropertyModel from "../models/PropertyModel.js";

export const getAgentProfile = async (req, res) => {
  const slug = req.query.agentSlug;
  const { _id } = req;
  try {
    const getAgentProfile = slug
      ? await AgentModel.findOne({ slug })
      : await AgentModel.findOne({ user: _id });
    if (!getAgentProfile)
      return res
        .status(404)
        .json({ error: true, message: "cant find agent profile" });
    const validationError = await getAgentProfile.validateSync();
    return res.status(200).json({
      error: false,
      profile: getAgentProfile,
      ...(validationError
        ? { profileCompleted: false }
        : { profileCompleted: true }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const updateAgentProfile = async (req, res) => {
  try {
    const { _id } = req;
    const { agentSlug } = req.body;
    const { name, field, phoneNumber, about, cover } = req.body;
    if (!name || !field || !phoneNumber || !about || !cover)
      return res
        .status(400)
        .json({ error: true, message: "please fill all field" });
    const updatedAgent = await AgentModel.findOneAndUpdate(
      { ...(agentSlug ? { slug: agentSlug } : { user: _id }) },
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
  const slug = req.params.agentSlug;
  try {
    const findAgents = user
      ? slug
        ? await AgentModel.find({ slug })
        : await AgentModel.find({ "&and": [{ user, publish: true }] })
      : await AgentModel.find({ publish: true });
    if (findAgents.length === 0)
      return res
        .status(404)
        .json({ error: true, message: "cant find agents or agent!" });
    return res.status(200).json({ error: false, agents: findAgents });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getAgents = async (req, res) => {
  try {
    const findAgents = await AgentModel.find({});

    if (findAgents.length === 0)
      return res
        .status(404)
        .json({ error: true, message: "cant find agents or agent!" });

    const agentsWithListingPromises = findAgents.map(async (agent) => {
      const agentObj = agent.toObject();
      agentObj.agentListing = await PropertyModel.find({ agent: agent._id });

      return await agentObj;
    });
    const agentsWithListing = await Promise.all(agentsWithListingPromises);
    return res.status(200).json({ error: false, agents: agentsWithListing });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const updateAgentPublishStatus = async (req, res) => {
  const { agentId, status } = req.body;
  if (!agentId || typeof status !== "boolean")
    return res
      .status(400)
      .json({ error: true, message: "please select a agent" });

  try {
    await AgentModel.findByIdAndUpdate({ _id: agentId }, { publish: status });
    return res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

import ContactModel from "../models/ContactModel.js";

export const getContactUsList = async (req, res) => {
  try {
    const contactList = await ContactModel.find({});
    if (!contactList) {
      return res.status(408).json({ error: true, message: "Refresh the page" });
    }
    return res.status(200).json({ error: false, contactList });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

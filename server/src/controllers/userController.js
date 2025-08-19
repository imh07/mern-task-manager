const User = require("../models/User");

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

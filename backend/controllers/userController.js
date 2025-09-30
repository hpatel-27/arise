const userService = require("../services/userService");

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

async function deleteUser(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await userService.deleteUser(id);
    res.json(user);
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id, 10);
    const data = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    // return the updated user
    const user = await userService.updateUser(id, data);
    // if it did not update, it will have thrown an error

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllUsers, getUserById, deleteUser, updateUser };

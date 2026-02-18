const userService = require("../services/userService");
const pickFields = require("../utils/pickFields");
const { userDTO } = require("../dtos/user.dto");

async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.json(users.map(userDTO));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const userId = req.user.userId;

    const user = await userService.getUserById(userId);
    res.json(userDTO(user));
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
    const userId = req.user.userId;

    const user = await userService.deleteUser(userId);
    res.json(userDTO(user));
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user.userId;

    const data = pickFields(req.body, [
      "firstName",
      "lastName",
      "age",
      "gender",
    ]);

    // return the updated user
    const user = await userService.updateUser(userId, data);
    // if it did not update, it will have thrown an error

    res.json(userDTO(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllUsers, getUserById, deleteUser, updateUser };

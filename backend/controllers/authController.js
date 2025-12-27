const authService = require("../services/authService");
const statService = require("../services/statService");
const { userDTO } = require("../dtos/user.dto");

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);

    // Initialize stats for the user
    await statService.initializeStats(user.id);
    return res.status(201).json(userDTO(user));
  } catch (error) {
    if (error.message === "Email already in use")
      return res.status(409).json({ error: error.message });
    else return res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    return res.json({ token });
  } catch (error) {
    if (error.message.includes("not registered")) {
      return res.status(404).json({ error: error.message });
    } else if (error.message.includes("Invalid password")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

// Google OAuth success callback
async function googleCallback(req, res) {
  // Passport attaches { user, token } to req.user
  const { user: userData, token } = req.user;
  const user = userDTO(userData);

  // Redirect frontend with token in query OR send JSON
  // res.redirect(`http://localhost:5173/home?token=${token}`);
  return res.json({ user: userDTO(user), token });
}

module.exports = { register, login, googleCallback };

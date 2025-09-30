import authService from "../services/authService";

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

// Google OAuth success callback
async function googleCallback(req, res) {
  // Passport attaches { user, token } to req.user
  const { user, token } = req.user;

  // Redirect frontend with token in query OR send JSON
  // res.redirect(`http://localhost:5173/home?token=${token}`);
  res.json({ user, token });
}

module.exports = { register, login, googleCallback };

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Username or email exists
 */
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, full_name, address, phone_number, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("username, email, password are required");
  }
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) {
    res.status(409);
    throw new Error("Username or email already exists");
  }
  const user = new User({ username, email, full_name, address, phone_number, role });
  await user.setPassword(password);
  await user.save();
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmail, password]
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid credentials
 */
export const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    res.status(400);
    throw new Error("usernameOrEmail and password are required");
  }
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = signToken(user);
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
});

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     username: { type: string }
 *                     email: { type: string }
 *                     role: { type: string }
 *                     created_at: { type: string, format: date-time }
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Username or email exists
 */
export const register = asyncHandler(async (req, res) => {
  const { user_name, email, password, full_name, address, phone_number, role } = req.body;
  if (!user_name || !email || !password) {
    res.status(400);
    throw new Error("user_name, email, password are required");
  }
  const exists = await User.findOne({ $or: [{ user_name }, { email }] });
  if (exists) {
    res.status(409);
    throw new Error("Username or email already exists");
  }
  const user = new User({ user_name, email, full_name, address, phone_number, role });
  await user.setPassword(password);
  await user.save();
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, user_name, email, role: user.role, created_at: user.created_at, wishlist: [] } });
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     username: { type: string }
 *                     email: { type: string }
 *                     role: { type: string }
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
    $or: [{ user_name: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = signToken(user);
  res.json({ token, user: { id: user._id, user_name: user.user_name, email: user.email, role: user.role, wishlist: user.wishlist || [] } });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password_hash").populate("wishlist");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.full_name = req.body.full_name || user.full_name;
    user.phone_number = req.body.phone_number || user.phone_number;
    user.address = req.body.address || user.address;
    if (req.body.password) {
      await user.setPassword(req.body.password);
    }
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      user_name: updatedUser.user_name,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      phone_number: updatedUser.phone_number,
      address: updatedUser.address,
      role: updatedUser.role,
      wishlist: updatedUser.wishlist,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.id;

  if (user) {
    const isLiked = user.wishlist.includes(productId);
    if (isLiked) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

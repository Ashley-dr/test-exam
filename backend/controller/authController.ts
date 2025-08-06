import bcrypt from "bcryptjs";
import { User } from "../models";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 25252525;
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (!user.password) {
      return res.status(500).json({ error: "User has no password set." });
    }

    console.log("Incoming password:", password);
    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const payload = { userId: user.id, username: user.username };
    const JWT_SECRET = process.env.JWT_SECRET || "25252525";

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ accessToken: token, username: user.username, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

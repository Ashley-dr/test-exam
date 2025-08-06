import express from "express";
import cors from "cors";
import { syncDb } from "./models/index.ts";
import movieRoutes from "./routes/movieRoutes.ts";
import authRoutes from "./routes/authRoutes.ts";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);

app.get("/", (req, res) => {
  return res.json("Server starting");
});

const startServer = async () => {
  try {
    await syncDb();
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error syncing database server:", error);
    process.exit(1);
  }
};

startServer();

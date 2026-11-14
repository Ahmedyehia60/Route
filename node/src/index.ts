import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes";
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("RouteFlow API is running!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
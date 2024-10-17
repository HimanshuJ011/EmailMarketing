import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "Hello" });
});

app.use("/api", apiRoutes);

// Jobs Import
import "./jobs/index.js";

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

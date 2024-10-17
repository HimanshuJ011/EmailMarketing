import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/api.js";
import cors from "cors";
import { dbConnect } from "./Database/db.config.js";
dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());

dbConnect();

app.get("/", (req, res) => {
  return res.json({ message: "Hello" });
});

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});

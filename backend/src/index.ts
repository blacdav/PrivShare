import express from "express";
import cors from "cors";
import router from "./routes";
import { dbConn } from "./db";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    methods: ["POST", "GET", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.json({ message: "Hello!" })
})

app.use("/api/v1", router);

dbConn()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
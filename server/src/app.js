import express from "express";
import cors from "cors";
import reportRouter from "./routes/report.js";
import assetsRouter from "./routes/assets.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/report", reportRouter);
app.use("/api/assets", assetsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
});

import { Router } from "express";
import { searchAssets } from "../services/assetService.js";

const router = Router();

router.get("/search", async (req, res) => {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  if (!query) {
    return res.status(400).json({ error: "query_required" });
  }
  try {
    const results = await searchAssets(query);
    return res.json({ results });
  } catch (err) {
    return res.status(500).json({ error: "server_error", details: err.message });
  }
});

export default router;

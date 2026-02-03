import { Router } from "express";
import { validateReportRequest } from "../services/validation.js";
import { createReport } from "../services/reportService.js";

const router = Router();

router.post("/", async (req, res) => {
  const { value, errors } = validateReportRequest(req.body);
  if (errors?.length) {
    return res.status(400).json({ error: "validation_error", details: errors });
  }

  try {
    const result = await createReport(value);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "server_error", details: err.message });
  }
});

export default router;

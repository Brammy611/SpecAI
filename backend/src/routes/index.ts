import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.post("/analyze", async (req, res) => {
  try {
    const { repo_url, requirement } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: "Requirement is required" });
    }

    const dataDir = path.join(process.cwd(), "data");
    
    // Ensure the data directory exists
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Generate a unique filename using timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `input-${timestamp}.json`;
    const filePath = path.join(dataDir, filename);

    // Prepare data to save
    const dataToSave = {
      repo_url,
      requirement,
      saved_at: new Date().toISOString(),
    };

    // Write the JSON file
    await fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2));

    // Return success response to frontend
    res.json({
      message: "Input successfully saved",
      filename,
      data: dataToSave
    });
  } catch (error) {
    console.error("Error saving input data:", error);
    res.status(500).json({ error: "Failed to save input data" });
  }
});

export default router;

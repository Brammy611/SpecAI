import { Response } from "express";

import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middleware/auth-middleware";

export async function listHistory(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const items = await prisma.analysisHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      repoUrl: true,
      businessRequirement: true,
      createdAt: true,
    },
  });

  res.json({ ok: true, items });
}

export async function getHistoryById(req: AuthRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const item = await prisma.analysisHistory.findFirst({
    where: { id, userId },
    select: {
      id: true,
      repoUrl: true,
      businessRequirement: true,
      resultData: true,
      createdAt: true,
    },
  });

  if (!item) {
    return res.status(404).json({ error: "History not found" });
  }

  res.json({
    ok: true,
    idAnalisis: item.id,
    repoUrl: item.repoUrl ?? "",
    businessRequirement: item.businessRequirement ?? "",
    analysis: item.resultData,
    createdAt: item.createdAt,
  });
}

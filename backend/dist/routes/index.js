"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project-controller");
const auth_controller_1 = require("../controllers/auth-controller");
const history_controller_1 = require("../controllers/history-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.json({ ok: true });
});
// Auth
router.post("/auth/register", auth_controller_1.register);
router.post("/auth/login", auth_controller_1.login);
router.get("/auth/me", auth_middleware_1.requireAuth, auth_controller_1.getMe);
/**
 * POST /api/analyze
 * Body: { repoUrl: string; businessRequirement: string; githubToken?: string }
 * Returns the full ImpactAnalysis JSON.
 */
// Allow saving history when user is logged in; still supports guest analysis.
router.post("/analyze", auth_middleware_1.optionalAuth, project_controller_1.analyzeProject);
router.get("/analysis/:idAnalisis", project_controller_1.getAnalysis);
router.get("/analysis/:idAnalisis/export", project_controller_1.exportAnalysis);
router.get("/analyze/:idAnalisis/export", project_controller_1.exportAnalysis);
// History (requires login)
router.get("/history", auth_middleware_1.requireAuth, history_controller_1.listHistory);
router.get("/history/:id", auth_middleware_1.requireAuth, history_controller_1.getHistoryById);
exports.default = router;

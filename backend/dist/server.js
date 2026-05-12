"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// IMPORTANT: routes import must happen after dotenv.config(),
// because downstream modules (e.g., Prisma client) read env vars at import time.
// Static imports are hoisted in CommonJS, so we use a runtime require here.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes = require("./routes").default;
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ name: "SpecAi backend" });
});
app.use("/api", routes);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

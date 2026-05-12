import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// IMPORTANT: routes import must happen after dotenv.config(),
// because downstream modules (e.g., Prisma client) read env vars at import time.
// Static imports are hoisted in CommonJS, so we use a runtime require here.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes = require("./routes").default;

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "SpecAi backend" });
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

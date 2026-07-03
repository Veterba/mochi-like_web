import express from "express";
import { sql } from "./db.js";

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  const rows = await sql`select now()`;
  res.json({ok: true, db_time: rows[0].now});
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

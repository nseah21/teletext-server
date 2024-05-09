const { sql } = require("@vercel/postgres");

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
    origin: ["https://teletext-wrapper.vercel.app"]
}));

app.get("/", async (req, res) => {
    return res.json("Hello there!")
});

app.get("/metadata", async (req, res) => {
    const result = await sql`SELECT id, date FROM Draws ORDER BY id DESC;`;
    const metadata = result.rows;
    return res.json(metadata);
})

app.get("/draws/:id", async (req, res) => {
    const result = await sql`SELECT * FROM Draws WHERE id = ${req.params.id};`;
    const draws = result.rows[0];
    return res.json(draws);
});

app.get("/latest", async (req, res) => {
    const result = await sql`SELECT * FROM Draws ORDER BY id DESC LIMIT 1`;
    const latestDraw = result.rows[0];
    return res.json(latestDraw);
});

module.exports = app;
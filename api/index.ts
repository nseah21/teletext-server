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

app.get("/cron", async (req, res) => {
    const data = await fetch("https://teletext-python-scraper.onrender.com/data");
    const results = await data.json();
    const { date, id, first, second, third, starter, consolation } = results;

    const checkIfExists = await sql`SELECT FROM Draws WHERE id = ${id}`;
    if (checkIfExists.rows.length > 0) {
        return res.json({ "message": "Results have already been updated." })
    } else {
        const outcome = await sql`INSERT INTO 
      Draws (id, date, first, second, third, starter, consolation) 
      VALUES (${id}, ${date}, ${first}, ${second}, ${third}, ${starter}, ${consolation})`;
        if (outcome.rowCount == 1) {
            return res.json({ "message": `Results for draw ${id} have been posted successfully.` });
        } else {
            return res.json({ "message": "Unable to post draw results. Something went wrong." }, { status: 500 })
        };
    }
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
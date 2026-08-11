import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bazzar Grocery Market API");
});

export default app;
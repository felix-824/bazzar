import express from "express";

/** 1-ENTRANCE **/
const app = express();

app.get("/", (req, res) => {
    res.send("Bazzar Grocery Market API");
});

export default app;
import express from "express";
import router from "./router";

/** 1-ENTRANCE **/
const app = express();

app.use(express.json()); // REST api ga xizmat Midlweri
app.use(express.urlencoded({ extended: true }));

/** ROUTERS **/
app.use("/", router);

export default app;
import express from "express";
import router from "./router";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";
import cookieParser from "cookie-parser";
import routerAdmin from "./router-admin";
import path from "path";

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
 uri: String (process.env.MONGO_URL),
 collection: "session",
});

/** 1-ENTRANCE **/
const app = express();

app.use(express.json()); // REST api ga xizmat Midlweri
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** 2-SESSION */
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie: {
            maxAge: 1000 * 3600 * 6,
        },
        resave: true,
        saveUninitialized: false,
        store: store,
    })
);

app.use(function(req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});


app.use("/uploads", express.static("./uploads"));


/** ROUTERS **/
app.use("/admin", routerAdmin);
app.use("/", router);

export default app;
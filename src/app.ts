import express from "express";
import router from "./router";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";
import cookieParser from "cookie-parser";
import routerAdmin from "./router-admin";
import path from "path";
import cors from "cors";



const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "session",
});

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);



app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);



app.use(
    express.static(
        path.join(__dirname, "public")
    )
);



app.use(express.json());



app.use(
    express.urlencoded({
        extended: true,
    })
);


app.use(cookieParser());


app.use(
    session({
        secret: String(
            process.env.SESSION_SECRET
        ),

        cookie: {
            // Admin session 6 soat yashaydi.
            maxAge: 1000 * 3600 * 6,
        },

        resave: true,

        saveUninitialized: false,

        // Session MongoDBda saqlanadi.
        store: store,
    })
);




 
app.use(
    function(req, res, next) {

        const sessionInstance =
            req.session as T;

        res.locals.member =
            sessionInstance.member;

        next();
    }
);


app.use(
    "/uploads",
    express.static("./uploads")
);


// ============================================
// 9. ROUTERS
// ============================================

app.use(
    "/admin",
    routerAdmin
);

app.use(
    "/",
    router
);

export default app;
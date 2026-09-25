require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { getPool } = require("./config/database.js");





const SECURE_SESSION = process.env.SECURE_SESSION === "true";

// ------------------------------------------------------------
// CREAZIONE DELL'APPLICAZIONE EXPRESS
// ------------------------------------------------------------
const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.TRUST_PROXY === "true") {
    app.set("trust proxy", 1);
}

// ------------------------------------------------------------
// SESSION
// ------------------------------------------------------------
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: SECURE_SESSION,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ------------------------------------------------------------
// FILE STATICI
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------
// const apiRoutes = require("./routes/api.routes");
// const loginRoutes = require("./routes/login.routes");

// app.use("/", apiRoutes);
// app.use("/", loginRoutes);

const pagesRoutes = require("./routes/pages.routes");
const managersRoutes = require("./routes/managers.routes");
app.use("/", managersRoutes);
app.use("/", pagesRoutes);

// ------------------------------------------------------------
// AVVIO DEL SERVER
// ------------------------------------------------------------
async function startServer() {
    try {
        await getPool();
        console.log("Connected to database");

        app.listen(port, "127.0.0.1", () => {
            console.log("==========================================");
            console.log(`Server running at http://localhost:${port}`);
            console.log("==========================================");
        });

    } catch (error) {
        console.error("Could not connect to database:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
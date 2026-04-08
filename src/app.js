const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const routes = require("./routes");
const webhookRoutes = require("./routes/webhook");

const {errorHandler} = require("./middleware/error.middleware");
const rateLimitMiddleware = require("./middleware/rateLimit.middleware");

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middlewares
|--------------------------------------------------------------------------
*/

app.use(helmet()); // secure HTTP headers
app.use(cors());   // allow cross origin requests
app.use(rateLimitMiddleware.apiLimiter); // protect from brute-force attacks

// ✅ Register webhook BEFORE body parser
app.use("/webhook", 
    express.raw({ type: "*/*" }),
    webhookRoutes
);

/*
|--------------------------------------------------------------------------
| Body Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

app.use(compression()); // gzip responses
app.use(morgan("dev")); // request logging

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
    });
});

app.get("/webhook-failures", async (req, res) => {
    const events = await knex("webhook_events")
        .where("processed", false)
        .orderBy("created_at", "desc");

    res.json(events);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api", routes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/
app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

module.exports = app;
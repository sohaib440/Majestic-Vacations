// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

/* ROUTES */
const indexRouter = require("./routes/index");
const stripeWebhookRouter = require("./webhooks/stripeWebhook");
const paypalWebhookRouter = require("./webhooks/paypalWebhook");

/* DB */
const { connectDatabase } = require("./config/database");
const initializeAdmin = require("./utils/initializeAdmin");

const app = express();

/* =========================================================
   1️⃣ STRIPE WEBHOOK — MUST BE FIRST (RAW BODY)
========================================================= */
app.use(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookRouter
);

/* =========================================================
   2️⃣ TRUST PROXY (for ngrok / reverse proxy)
========================================================= */
app.set("trust proxy", 1);

/* =========================================================
   3️⃣ SECURITY HEADERS
========================================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* =========================================================
   4️⃣ CORS
========================================================= */
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/* =========================================================
   5️⃣ RATE LIMITING
========================================================= */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =========================================================
   6️⃣ BODY PARSERS (AFTER WEBHOOK)
========================================================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   7️⃣ SANITIZATION (AFTER BODY PARSING)
========================================================= */
app.use(mongoSanitize());
app.use(xss());

/* =========================================================
   8️⃣ STATIC FILES
========================================================= */
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================================================
   9️⃣ OTHER WEBHOOKS (NOT STRIPE)
========================================================= */
app.use("/webhooks/paypal", paypalWebhookRouter);

/* =========================================================
   🔟 API ROUTES
========================================================= */
app.use("/api", indexRouter);

/* =========================================================
   1️⃣1️⃣ DATABASE CONNECTION
========================================================= */
connectDatabase()
  .then(() => {
    console.log("✅ Database connected");
    initializeAdmin();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

/* =========================================================
   1️⃣2️⃣ GLOBAL ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================================================
   1️⃣3️⃣ START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

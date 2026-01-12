// server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const path = require("path");

const indexRouter = require("./routes/index");
const { connectDatabase } = require("./config/database");
const initializeAdmin = require("./utils/initializeAdmin");

const app = express();

/*  TRUST PROXY (for rate limit behind proxy) */
app.set("trust proxy", 1);

/*  SECURITY HEADERS */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/*  SANITIZATION */
app.use(mongoSanitize());
app.use(xss());

/*  CORS CONFIGURATION */
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

/*  RATE LIMITING */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/*  STATIC FILES (UPLOADS) */
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

/*  WEBHOOK ROUTES – Use bodyParser.raw only here */
app.use(
  "/webhook",
  require("body-parser").raw({ type: "application/json" }),
  require("./webhooks/stripeWebhook")
);

/*  OTHER ROUTES – normal JSON parsing */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/webhooks/paypal", require("./webhooks/paypalWebhook"));
app.use("/api", indexRouter);

/*  DATABASE CONNECTION */
connectDatabase()
  .then(() => {
    console.log("✅ Database connected");
    initializeAdmin();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

/*  ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/*  START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

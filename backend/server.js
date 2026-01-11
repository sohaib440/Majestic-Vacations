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

/*  BASIC MIDDLEWARE*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*  SECURITY HEADERS (FIXED)*/
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Ensure static assets (images) are accessible cross-origin
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

/*  SANITIZATION*/
app.use(mongoSanitize());
app.use(xss());

/*  CORS CONFIGURATION*/
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/*  RATE LIMITING*/
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/*  STATIC FILES (UPLOADS)*/
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*  ROUTES*/
app.use("/webhooks/stripe", require("./webhooks/stripeWebhook"));
app.use("/webhooks/paypal", require("./webhooks/paypalWebhook"));
app.use("/api", indexRouter);

/*  DATABASE CONNECTION*/
connectDatabase()
  .then(() => {
    console.log("✅ Database connected");
    initializeAdmin();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

/*  ERROR HANDLER*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/*  START SERVER*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

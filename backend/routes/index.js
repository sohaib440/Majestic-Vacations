const express = require("express");
const router = express.Router();

const auth = require("./auth");
const user = require("./users");
const tour = require("./tour");
const inquiry = require("./inquiry.route");
const booking =require("./bookingRoutes")
const payment = require("./payment.routes")

router.use("/auth", auth);
router.use("/user", user);
router.use("/tour", tour);
router.use("/inquiry", inquiry);
router.use("/booking", booking)
router.use("/payment", payment)

module.exports = router;

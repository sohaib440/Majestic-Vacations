const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/", (req, res, next) => {
  console.log("📥 POST /payment route hit");
  next();
}, paymentController.createPayment);

router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.put("/:id", paymentController.updatePayment);
router.delete("/:id", paymentController.deletePayment);







module.exports = router;

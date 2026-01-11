const express = require("express");
const router = express.Router();
const { protect,isAdmin,checkPermission } = require("../middleware/auth");
const userController = require("../controllers/userController");

// router.post("/create", protect,isAdmin,userController.createUser);
// router.put("/permissions/:userId", protect,isAdmin,userController.setPermissions);
// router.get("/reports", protect, checkPermission("view_reports"), (req,res)=>res.json({message:"Reports data"}));

module.exports = router;

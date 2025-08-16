const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authenticate = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

// Auth
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// User
router.get("/profile", authenticate, UserController.getProfile);
router.put("/profile", authenticate, UserController.updateProfile);
router.patch("/profile/password", authenticate, UserController.updatePassword);
router.delete("/profile", authenticate, UserController.deleteAccount);

// Admin
router.get("/", authenticate, requireRole(["admin"]), UserController.getAllUsers);

module.exports = router;

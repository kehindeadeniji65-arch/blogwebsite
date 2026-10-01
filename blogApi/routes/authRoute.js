const express = require("express");
const { registerUser, loginUser, getUserProfile,deleteUser, getAllUsers, googleLogin, googleSignup, updateProfile, deleteMyAccount} = require("../controllers/authController");
const { protect ,admin} = require("../middleware/authMiddleware");
const roleBaseMiddleware  = require("../middleware/roleBaseMiddleware");
const router = express.Router()


router.post("/register", registerUser)
router.get("/register", registerUser)
router.post("/login", loginUser)
router.post('/auth/google/login', googleLogin);
router.post('/auth/google/signup', googleSignup);
router.get("/profile", protect, getUserProfile)
router.get("/users", protect, admin, getAllUsers)
router.delete("/delete/:id", protect, roleBaseMiddleware('admin'), deleteUser)
router.patch("/profile", protect, updateProfile)
router.delete("/profile", protect, deleteMyAccount)

module.exports = router;
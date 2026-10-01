const express = require("express")
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogsController")
const { protect, optionalAuth } = require("../middleware/authMiddleware")
const upload = require("../config/upload")
const router = express.Router()

router.post('/blogs', protect, upload.single('image'), createBlog)
router.get("/blogs", optionalAuth, getBlogs)
router.get("/blogs/:id", getBlogById)
router.patch('/blogs/:id', protect, upload.single('image'), updateBlog)
router.delete('/blogs/:id', protect, deleteBlog)

module.exports = router;
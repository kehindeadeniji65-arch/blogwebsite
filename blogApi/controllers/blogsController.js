const Cloudinary = require("../config/cloudinary");
const Blog = require("../models/blog");



const createBlog = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const result = await Cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: "blog_images",
      });
      imageUrl = result.secure_url;
    }

    const blogData = await Blog.create({ ...req.body, image: imageUrl, createdBy: req.user.id });
    res.status(200).json({ message: "Blog created successfully", blog: blogData });

  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.mine === 'true' && req.user) filter.createdBy = req.user.id;

    const blogs = await Blog.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy', 'name email');
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const isOwner = blog.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    const updateData = { ...req.body };

    // only an admin can change status; strip it out if a non-admin tries
    if (!isAdmin) {
      delete updateData.status;
    }

    if (req.file) {
      const result = await Cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
        folder: "blog_images",
      });
      updateData.image = result.secure_url;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Blog updated successfully", blog: updated });

  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const isOwner = blog.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
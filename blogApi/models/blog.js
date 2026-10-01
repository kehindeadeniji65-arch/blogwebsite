const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},
  title: {
    type: String,
        required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
        type: String,
        default: "general"
    },
    published: {
        type: Boolean,
        default: true
  },
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending'
    },
},
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Blog', blogSchema);

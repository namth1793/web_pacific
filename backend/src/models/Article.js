const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    category: {
      type: String,
      enum: ['news', 'events', 'conference', 'internship', 'research', 'student'],
      required: true,
    },
    featuredImage: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    translations: {
      type: Map,
      of: translationSchema,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, category: 1 });
articleSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);

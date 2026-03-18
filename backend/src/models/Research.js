const mongoose = require('mongoose');

const researchTranslationSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    abstract: { type: String, default: '' },
    content: { type: String, default: '' },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const researchSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['faculty', 'student'],
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
    },
    translations: {
      type: Map,
      of: researchTranslationSchema,
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
  }
);

researchSchema.index({ slug: 1 });
researchSchema.index({ type: 1, year: -1 });
researchSchema.index({ tags: 1 });

module.exports = mongoose.model('Research', researchSchema);

const mongoose = require('mongoose');

const programTranslationSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    objectives: { type: String, default: '' },
    curriculum: { type: [String], default: [] },
    requirements: { type: String, default: '' },
    tuition: { type: String, default: '' },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
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
      enum: ['formal', 'non-formal', 'postgraduate'],
      required: true,
    },
    duration: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      default: '',
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
      of: programTranslationSchema,
      default: () => new Map(),
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

programSchema.index({ slug: 1 });
programSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Program', programSchema);

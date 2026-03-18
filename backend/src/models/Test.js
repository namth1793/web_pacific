const mongoose = require('mongoose');

const testTranslationSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (v) => v.length === 4,
        message: 'Each question must have exactly 4 options',
      },
      required: true,
    },
    correctIndex: {
      type: Number,
      min: 0,
      max: 3,
      required: true,
    },
    explanation: { type: String, default: '' },
  },
  { _id: true }
);

const testSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['N5', 'N4', 'N3', 'N2', 'N1', 'general'],
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
      comment: 'Duration in minutes',
    },
    passingScore: {
      type: Number,
      default: 60,
      comment: 'Passing score as percentage',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    translations: {
      type: Map,
      of: testTranslationSchema,
      default: () => new Map(),
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

testSchema.index({ slug: 1 });
testSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Test', testSchema);

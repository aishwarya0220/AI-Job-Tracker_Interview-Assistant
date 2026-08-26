const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['dev', 'leetcode', 'learning', 'admin', 'personal'],
      default: 'dev',
    },
    status: {
      type: String,
      enum: ['backlog', 'scheduled', 'in_progress', 'review', 'completed'],
      default: 'backlog',
      index: true,
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    position: { type: Number, default: 0 }, // Order rank inside column
    scheduledDate: { type: String, default: null }, // YYYY-MM-DD
    dueDate: { type: String, default: null },
    metadata: {
      leetcodeDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
      topicTag: { type: String },
      repoName: { type: String },
      branch: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
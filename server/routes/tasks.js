const express = require('express');

const router = express.Router();

const Task = require('../models/tasks')

const authenticationToken = require('../middleware/auth')

// GET /api/tasks - Fetch all tasks for the logged-in user sorted by position
router.get('/', authenticationToken, async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id }).sort({ position: 1 });
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// POST /api/tasks - Create a new task card
router.post('/', authenticationToken, async (req, res) => {
    try {
      const { title, description, category, status, priority, scheduledDate, dueDate, metadata } = req.body;
  
      // Find current highest position in the target status column to append at the bottom
      const lastTask = await Task.findOne({ user: req.user.id, status })
        .sort({ position: -1 })
        .exec();
  
      const newPosition = lastTask ? lastTask.position + 1 : 0;
  
      const task = new Task({
        user: req.user.id,
        title,
        description,
        category: category || 'dev',
        status: status || 'backlog',
        priority: priority || 'medium',
        position: newPosition,
        scheduledDate,
        dueDate,
        metadata,
      });
  
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// PATCH /api/tasks/reorder - BATCH REORDER (Must be declared before /:id routes)
router.patch('/reorder', authenticationToken, async (req, res) => {
    try {
      const { items } = req.body;
  
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Payload must contain an array of items.' });
      }
  
      const bulkOperations = items.map((item) => ({
        updateOne: {
          filter: { _id: item._id, user: req.user.id },
          update: { $set: { status: item.status, position: item.position } },
        },
      }));
  
      const result = await Task.bulkWrite(bulkOperations);
      res.status(200).json({ message: 'Reordered successfully', result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', authenticationToken, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})


module.exports = router

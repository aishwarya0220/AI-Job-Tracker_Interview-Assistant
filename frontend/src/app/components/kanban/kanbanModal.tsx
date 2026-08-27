'use client';

import React, { useState, useEffect, SubmitEvent } from 'react';
import { 
  ITask, 
  TaskCategory, 
  TaskPriority, 
  TaskStatus, 
  LeetCodeDifficulty 
} from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<ITask>) => Promise<void>;
  initialTask?: ITask | null; // If provided, modal operates in EDIT mode
  defaultStatus?: TaskStatus;  // Default column for new tasks
}

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialTask,
    defaultStatus = 'backlog',
  }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TaskCategory>('dev');
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [status, setStatus] = useState<TaskStatus>(defaultStatus);
    const [scheduledDate, setScheduledDate] = useState('');
    
    // LeetCode Metadata state
    const [leetcodeDifficulty, setLeetcodeDifficulty] = useState<LeetCodeDifficulty>('Medium');
    const [topicTag, setTopicTag] = useState('');
    const [loading, setLoading] = useState(false)

    // Populate state on edit or reset on create
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setCategory(initialTask.category || 'dev');
      setPriority(initialTask.priority || 'medium');
      setStatus(initialTask.status || defaultStatus);
      setScheduledDate(initialTask.scheduledDate || '');
      setLeetcodeDifficulty(initialTask.metadata?.leetcodeDifficulty || 'Medium');
      setTopicTag(initialTask.metadata?.topicTag || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('dev');
      setPriority('medium');
      setStatus(defaultStatus);
      setScheduledDate('');
      setLeetcodeDifficulty('Medium');
      setTopicTag('');
    }
  }, [initialTask, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);

    const payload: Partial<ITask> = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      scheduledDate: scheduledDate || undefined,
      metadata: category === 'leetcode' ? {
        leetcodeDifficulty,
        topicTag: topicTag.trim() || undefined
      } : undefined
    };

    if (initialTask?._id) {
      payload._id = initialTask._id;
    }

    try {
        await onSave(payload);
        onClose();
      } catch (err) {
        console.error('Failed to save task:', err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              {initialTask ? '✏️ Edit Task' : '✨ Create New Task'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              ✕
            </button>
          </div>

          {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 15. 3Sum or Implement Auth Middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add key context, links, or algorithm approach..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Row 1: Category & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="dev">Dev Project</option>
                <option value="leetcode">LeetCode Problem</option>
                <option value="learning">Learning Goal</option>
                <option value="admin">Admin / Work</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Row 2: Status Column & Scheduled Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Target Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="backlog">Backlog</option>
                <option value="scheduled">Scheduled / Calendar</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review / Revision</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conditional Metadata: LeetCode Specific Fields */}
          {category === 'leetcode' && (
            <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                🧩 LeetCode Details
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={leetcodeDifficulty}
                    onChange={(e) => setLeetcodeDifficulty(e.target.value as LeetCodeDifficulty)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Topic / Pattern Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Two Pointers, Graphs"
                    value={topicTag}
                    onChange={(e) => setTopicTag(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition"
            >
              {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
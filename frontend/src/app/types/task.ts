export type TaskCategory = 'dev' | 'leetcode' | 'learning' | 'admin' | 'personal';
export type TaskStatus = 'backlog' | 'scheduled' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type LeetCodeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface TaskMetadata {
  leetcodeDifficulty?: LeetCodeDifficulty;
  topicTag?: string;
  repoName?: string;
  branch?: string;
}

export interface ITask {
  _id: string;
  user: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  scheduledDate?: string; // YYYY-MM-DD
  dueDate?: string;
  metadata?: TaskMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnDefinition {
  id: TaskStatus;
  title: string;
  accentColor: string;
}
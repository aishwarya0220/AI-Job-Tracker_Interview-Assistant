export interface Job{
    _id: string,
    company: string,
    position: string,
    jobDescription: string,
    status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected'
    createdAt?: string
}

export interface interviewQuestion {
    question: string,
    userAnswer?: string
}

export type TaskCategory = 'dev' | 'leetcode' | 'admin' | 'learning' | 'personal'

export type TaskStatus = 'backlog' | 'scheduled' | 'in_progress' | 'revision' | 'completed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
    _id: string,
    user: string
    title: string,
    description: string,
    category: TaskCategory,
    priority: TaskPriority,
    status: TaskStatus,
    position: number,
    scheduledDate?: string,
    dueDate?: string,
    createdAt?: string,
    updatedAt?: string
}
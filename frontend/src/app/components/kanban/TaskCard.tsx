'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ITask } from '@/types/task';
import apiRequest from '@/utils/api';

interface TaskCardProps {
  task: ITask;
  index: number;
  onDelete?: (taskId: string) => void
}

const categoryStyles: Record<string, string> = {
  dev: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  leetcode: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  learning: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  admin: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  personal: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const difficultyStyles: Record<string, string> = {
    Easy: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    Medium: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    Hard: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if(!confirm(`Are you sure you want to delete ${task.title} task?`)) return

        setIsDeleting(true)
        try{
            await apiRequest(`http://localhost:8000/tasks/${task._id}`, 'DELETE')
            if(onDelete){
                onDelete(task._id)  
            }
         
        }catch(err){
            console.log('Failed to delete job', err)
        }finally{
            setIsDeleting(false)
        }
    }

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3.5 mb-3 bg-slate-900 border rounded-xl transition-all shadow-md select-none ${
                        snapshot.isDragging
                          ? 'border-blue-500 shadow-blue-500/10 shadow-2xl scale-[1.02] rotate-1 z-50'
                          : 'border-slate-800 hover:border-slate-700'
                      } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                    >

                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                            <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${
                                categoryStyles[task.category] || 'bg-slate-800 text-slate-300'
                            }`}
                            >
                            {task.category}
                            </span>

                            {task.scheduledDate && (
                            <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                📅 {task.scheduledDate}
                            </span>
                            )}
                        </div>

                        {/* Direct Delete Button */}
                        <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        title="Delete Task"
                        className="px-1.5 py-0.5 text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 rounded-md transition-colors"
                        >
                        {isDeleting ? '...' : '✕'}
                        </button>
                    </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-slate-100 leading-snug mb-1">
                            {task.title}
                        </h4>

                        {/* Description / Subtext */}
                        {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                            {task.description}
                            </p>
                        )}

                        {/* LeetCode Specific Metadata Badge */}
                        {task.category === 'leetcode' && task.metadata?.leetcodeDifficulty && (
                            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                            <span
                                className={`px-2 py-0.5 rounded border font-medium ${
                                difficultyStyles[task.metadata.leetcodeDifficulty]
                                }`}
                            >
                                {task.metadata.leetcodeDifficulty}
                            </span>

                            {task.metadata.topicTag && (
                                <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                                #{task.metadata.topicTag}
                                </span>
                            )}
                            </div>
                        )}
                    </div>
            )}

        </Draggable>
    )
}
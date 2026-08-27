'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ITask, ColumnDefinition } from '@/types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: ITask[];
  onTaskClick?: (task: ITask) => void
  onAddTask?: () => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, onAddTask, onTaskClick }) => {
  return (
    <div className="flex flex-col w-72 min-w-70 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 h-[78vh]">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.accentColor}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {column.title}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto pr-1 transition-colors rounded-xl ${
              snapshot.isDraggingOver ? 'bg-slate-900/40 ring-1 ring-blue-500/30' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <div key={task._id} onClick={() => onTaskClick?.(task)}>
                <TaskCard task={task} index={index} />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
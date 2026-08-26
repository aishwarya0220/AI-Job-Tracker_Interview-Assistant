'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ITask, TaskStatus, ColumnDefinition } from '@/types/task';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';

interface KanbanBoardProps {
  initialTasks: ITask[];
  onReorderSave?: (updatedTasks: { _id: string; status: TaskStatus; position: number }[]) => Promise<void>;
}

const COLUMNS: ColumnDefinition[] = [
  { id: 'backlog', title: 'Backlog', accentColor: 'bg-slate-500' },
  { id: 'scheduled', title: 'Scheduled / Calendar', accentColor: 'bg-amber-500' },
  { id: 'in_progress', title: 'In Progress', accentColor: 'bg-blue-500' },
  { id: 'review', title: 'Review / Revision', accentColor: 'bg-purple-500' },
  { id: 'completed', title: 'Completed', accentColor: 'bg-emerald-500' },
];

export default function KanbanBoard({ initialTasks, onReorderSave }: KanbanBoardProps) {
    const [tasks, setTasks] = useState<ITask[]>(initialTasks);
  
    // Group tasks by their current status column and sort by position
    const getTasksByStatus = (status: TaskStatus) => {
      return tasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.position - b.position);
    }

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId} = result

        // Dropped outside a droppable area
        if (!destination) return;

        // Dropped in the exact same spot
        if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
        ) {
        return;
        }

        const sourceStatus = source.droppableId as TaskStatus
        const destinationStatus = destination.droppableId as TaskStatus

        // 1. Create shallow copies for immutable manipulation
        const newTasks = Array.from(tasks);
        const movedTask = newTasks.find((t) => t._id === draggableId);
        if (!movedTask) return;

        // 2. Separate target columns
        const sourceColumnTasks = getTasksByStatus(sourceStatus);
        const destColumnTasks =
        sourceStatus === destinationStatus                      // destStatus
            ? sourceColumnTasks
            : getTasksByStatus(destinationStatus);              // destStatus

        // 3. Remove item from source
        sourceColumnTasks.splice(source.index, 1);

        // 4. Update status if column changed
        movedTask.status = destinationStatus;                   // destStatus

        // 5. Insert into destination
        if (sourceStatus === destinationStatus) {
            sourceColumnTasks.splice(destination.index, 0, movedTask);
        } else {
            destColumnTasks.splice(destination.index, 0, movedTask);
        }

        // 6. Recalculate explicit rank position indices for affected columns
        const reorderedPayload: { _id: string; status: TaskStatus; position: number }[] = [];

        const updatedSourceTasks = sourceColumnTasks.map((task, idx) => {
        const updated = { ...task, position: idx };
        reorderedPayload.push({ _id: updated._id, status: updated.status, position: idx });
        return updated;
        });

        let updatedDestTasks: ITask[] = [];
        if (sourceStatus !== destinationStatus) {
        updatedDestTasks = destColumnTasks.map((task, idx) => {
            const updated = { ...task, position: idx };
            reorderedPayload.push({ _id: updated._id, status: updated.status, position: idx });
            return updated;
        });
        }

        // 7. Optimistic Local State Update
        const finalState = newTasks.map((t) => {
            const match = [...updatedSourceTasks, ...updatedDestTasks].find(
            (updated) => updated._id === t._id
            );
            return match || t;
        });

        setTasks(finalState);

    // 8. Background Sync API Call
    if (onReorderSave) {
      try {
        await onReorderSave(reorderedPayload);
      } catch (err) {
        console.error('Failed to sync reordered positions to server:', err);
        // Rollback state on error
        setTasks(initialTasks);
      }
    }
  };

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 items-start min-w-max">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={getTasksByStatus(col.id)}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ITask, TaskStatus, ColumnDefinition } from '@/types/task';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import apiRequest from '@/utils/api';
import { TaskModal } from './kanbanModal';

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
    const [tasks, setTasks] = useState<ITask[]>(initialTasks ?? []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [editingTask, setEditingTask] = useState<ITask | null>(null);

    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog')

    // 1. Fetch latest task list from DB via GET request
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest<ITask[]>('http://localhost:8000/tasks', 'GET');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks from database:', err);
    } finally {
      setIsLoading(false);
    }
  }, [])

    // Fetch from backend on initial mount
    useEffect(() => {
      fetchTasks();
    }, [fetchTasks])

    const handleOpenEditModal = (task: ITask) => {
      setEditingTask(task);
      setIsModalOpen(true);
    };

    // Open modal for CREATING a new task
    const handleOpenCreateModal = (status: TaskStatus = 'backlog') => {
      setEditingTask(null);
      setDefaultStatus(status);
      setIsModalOpen(true);
    }

    const handleDeleteTask = async () => {
      // Triggers React re-render by creating a new array without the deleted task
      await fetchTasks()
    }
  
    const handleSaveTask = async (taskData: Partial<ITask>) => {
      try{
          if (taskData._id) {

            await apiRequest<ITask>(`http://localhost:8000/tasks/${taskData._id}`, 'PUT', taskData);
          } else {
            
            const created = await apiRequest<ITask>('http://localhost:8000/tasks', 'POST', taskData);
          }
          await fetchTasks()
        } catch (err) {
          console.error('Failed to save task:', err);
        }
      }

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
        await fetchTasks()
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-x-auto">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs text-slate-400">
          Total Tasks: <strong className="text-slate-200">{tasks.length}</strong>
        </span>
        <button
          onClick={() => handleOpenCreateModal('backlog')}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition"
        >
          + Add Task
        </button>
      </div>

      {/* Board Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 items-start min-w-max flex-1">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={getTasksByStatus(col.id)}
              onTaskClick={handleOpenEditModal}
              onAddTask={() => handleOpenCreateModal(col.id)}
              onTaskDelete={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task Modal Integration */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
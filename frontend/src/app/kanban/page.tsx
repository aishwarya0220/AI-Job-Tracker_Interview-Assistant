import KanbanBoard from '@/components/kanban/KanbanBoard';

import { handleReorderSave } from './serverAction';

export default function TasksPage({ initialTasks }: {initialTasks: any[]}) {

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">📋 Daily Tasks</h1>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <KanbanBoard
          initialTasks={initialTasks}
          onReorderSave={handleReorderSave}
        />
      </main>
    </div>
  );
}
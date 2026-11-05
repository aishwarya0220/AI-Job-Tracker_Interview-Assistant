import Navbar from '@/components/Navbar';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default function TasksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <header className="mx-auto w-full max-w-[1600px] px-4 pb-2 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-100">Task tracker</h1>
        <p className="mt-1 text-sm text-slate-400">
          Plan your prep: drag tasks between columns to update their status.
        </p>
      </header>
      <main className="mx-auto w-full max-w-[1600px] flex-1 overflow-hidden px-2 sm:px-4">
        <KanbanBoard />
      </main>
    </div>
  );
}

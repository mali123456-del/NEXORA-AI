import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle, Circle, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { WorkspaceTask } from '../types';
import { fetchWorkspaceTasks, createWorkspaceTask, updateWorkspaceTask, deleteWorkspaceTask } from '../services/api';
import { useNotification } from '../context/NotificationContext';


interface TasksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TasksDrawer: React.FC<TasksDrawerProps> = ({ isOpen, onClose }) => {
  const { notify } = useNotification();
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('Workspace Local Engine');
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newDue, setNewDue] = useState('');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetchWorkspaceTasks();
      setTasks(res.tasks);
      setSource(res.source);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadTasks();
    }
  }, [isOpen]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const task = await createWorkspaceTask({
        title: newTitle.trim(),
        notes: newNotes.trim(),
        due: newDue || undefined,
      });
      setTasks([task, ...tasks]);
      setNewTitle('');
      setNewNotes('');
      setNewDue('');
      notify({
        type: 'success',
        title: 'Task Added to Queue',
        message: `"${task.title}" synced with Workspace queue.`,
      });
    } catch (err: any) {
      notify({
        type: 'error',
        title: 'Failed to Create Task',
        message: err.message,
      });
    }
  };

  const handleToggle = async (task: WorkspaceTask) => {
    const nextStatus = task.status === 'completed' ? 'needsAction' : 'completed';
    try {
      const updated = await updateWorkspaceTask(task.id, { status: nextStatus });
      setTasks(tasks.map(t => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Explicit confirmation dialog required for destructive operations per Google Workspace Skill
  const confirmDelete = async (id: string) => {
    try {
      await deleteWorkspaceTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      setDeleteConfirmationId(null);
      notify({
        type: 'info',
        title: 'Task Removed',
        message: 'Task was permanently deleted from Workspace queue.',
      });
    } catch (err: any) {
      notify({
        type: 'error',
        title: 'Delete Failed',
        message: err.message,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>GOOGLE TASKS & WORKSPACE</span>
            </h2>
            <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{source}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Creation Form */}
        <form onSubmit={handleCreate} className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2.5">
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="New workspace task title..."
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="Notes or execution details (optional)"
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <input
              type="date"
              value={newDue}
              onChange={e => setNewDue(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium font-mono flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task to Queue</span>
          </button>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">Syncing Google Tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">No active tasks in queue</div>
          ) : (
            tasks.map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => handleToggle(task)}
                      className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1 text-left">
                      <div className={`text-xs font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {task.title}
                      </div>
                      {task.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{task.notes}</p>
                      )}
                      {task.due && (
                        <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono mt-1.5">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>Due: {task.due}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteConfirmationId(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-md transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mandatory Explicit User Confirmation Dialog for Destructive Operation */}
                  {deleteConfirmationId === task.id && (
                    <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 animate-in fade-in duration-150">
                      <div className="flex items-start space-x-2 text-rose-300 text-xs font-mono">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Confirm Deletion</p>
                          <p className="text-[11px] text-rose-400 mt-0.5">
                            Are you sure you want to permanently delete this task from Google Tasks? This cannot be undone.
                          </p>
                        </div>
                      </div>
                      <div className="mt-2.5 flex justify-end space-x-2">
                        <button
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-mono hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => confirmDelete(task.id)}
                          className="px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-mono hover:bg-rose-500 shadow-sm"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Synced with Workspace OAuth</span>
          <span className="text-cyan-400">Least-Privilege Tasks Scope</span>
        </div>
      </div>
    </div>
  );
};

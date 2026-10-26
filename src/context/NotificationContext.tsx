import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  notify: (notification: Omit<NotificationItem, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<NotificationItem, 'id'>) => {
      const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
      const item: NotificationItem = { id, type, title, message, duration };
      setNotifications(prev => [...prev, item]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
      {/* Toast Notification Container with Accessibility Support */}
      <div
        role="region"
        aria-label="System Notifications"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none"
      >
        {notifications.map(n => {
          const isSuccess = n.type === 'success';
          const isWarning = n.type === 'warning';
          const isError = n.type === 'error';
          const isInfo = n.type === 'info';

          return (
            <div
              key={n.id}
              role="status"
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${
                isSuccess
                  ? 'bg-slate-900/95 border-emerald-600/60 text-slate-100 shadow-emerald-500/10'
                  : isWarning
                  ? 'bg-slate-900/95 border-amber-600/60 text-slate-100 shadow-amber-500/10'
                  : isError
                  ? 'bg-slate-900/95 border-rose-600/60 text-slate-100 shadow-rose-500/10'
                  : 'bg-slate-900/95 border-cyan-600/60 text-slate-100 shadow-cyan-500/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {isInfo && <Info className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className="flex-1 text-xs">
                <div className="font-semibold font-mono text-white tracking-wide">{n.title}</div>
                {n.message && <div className="text-slate-300 mt-0.5 leading-relaxed">{n.message}</div>}
              </div>

              <button
                onClick={() => removeNotification(n.id)}
                aria-label="Close notification"
                className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

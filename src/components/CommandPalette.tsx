import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  BookOpen,
  Zap,
  Settings,
  Layers,
  ArrowRight,
  X,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { EcosystemId } from '../types';
import { GLOBAL_SEARCH_INDEX, SearchItem, SearchCategory } from '../data/searchIndex';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: EcosystemId) => void;
  onOpenTasks?: () => void;
  onOpenAuditLogs?: () => void;
  onOpenDoc?: (docPath: string) => void;
  onToggleTheme?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenTasks,
  onOpenAuditLogs,
  onOpenDoc,
  onToggleTheme,
  onOpenRoleSwitcher,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 60);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filtered results
  const filteredResults = useMemo(() => {
    return GLOBAL_SEARCH_INDEX.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      if (!debouncedQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(debouncedQuery);
      const descMatch = item.description.toLowerCase().includes(debouncedQuery);
      const keywordMatch = item.keywords.some(k => k.includes(debouncedQuery));
      const badgeMatch = item.badge?.toLowerCase().includes(debouncedQuery);

      return titleMatch || descMatch || keywordMatch || badgeMatch;
    });
  }, [debouncedQuery, activeCategory]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1 < filteredResults.length ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
        } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
          e.preventDefault();
          executeItem(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredResults, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const executeItem = (item: SearchItem) => {
    onClose();

    if (item.actionId) {
      switch (item.actionId) {
        case 'ACTION_OPEN_TASKS':
          onOpenTasks?.();
          return;
        case 'ACTION_OPEN_AUDIT':
          onOpenAuditLogs?.();
          return;
        case 'ACTION_TOGGLE_THEME':
          onToggleTheme?.();
          return;
        case 'ACTION_SWITCH_ROLE':
          onOpenRoleSwitcher?.();
          return;
        case 'ACTION_RUN_SCAN':
          onSelectTab('ethical_hacking');
          return;
        case 'ACTION_SOLVE_CTF':
          onSelectTab('learning_academy');
          return;
        case 'ACTION_VIEW_TELEMETRY':
        case 'ACTION_SELECT_PLAN':
          onSelectTab('smart_workspace');
          return;
      }
    }

    if (item.docPath) {
      onOpenDoc?.(item.docPath);
      return;
    }

    if (item.ecosystemId) {
      onSelectTab(item.ecosystemId);
    }
  };

  // Text highlighter helper
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i} className="bg-cyan-500/20 text-cyan-300 font-semibold rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'ecosystems':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'docs':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'actions':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'settings':
        return <Settings className="w-4 h-4 text-emerald-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search and Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar Input */}
        <div className="p-3.5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-slate-400 ml-1 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search ecosystems, actions, documentation, tools..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-sans"
            aria-autocomplete="list"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center space-x-0.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            <span>ESC</span>
          </kbd>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center space-x-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all' as SearchCategory, label: 'All' },
            { id: 'ecosystems' as SearchCategory, label: 'Ecosystems' },
            { id: 'actions' as SearchCategory, label: 'Actions' },
            { id: 'docs' as SearchCategory, label: 'Documentation' },
            { id: 'settings' as SearchCategory, label: 'Settings' },
          ].map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
          <div className="ml-auto text-[11px] font-mono text-slate-500 hidden sm:block">
            {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
          </div>
        </div>

        {/* Search Results List */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="max-h-96 overflow-y-auto p-2 space-y-1 bg-slate-900"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-6 h-6 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400 font-mono">No matching records found for "{debouncedQuery}"</div>
              <div className="text-[11px] text-slate-600">Try searching for an ecosystem, documentation topic, or action.</div>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-colors group ${
                    isSelected
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-start space-x-3 truncate pr-2">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold truncate text-white">
                          {renderHighlighted(item.title, debouncedQuery)}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {renderHighlighted(item.description, debouncedQuery)}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2 mt-1">
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-400">
                        <span>Select</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info & shortcut cues */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono px-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↵</kbd>
              <span>execute</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">esc</kbd>
              <span>close</span>
            </span>
          </div>
          <span className="text-slate-400">NEXORA Global Intelligence</span>
        </div>
      </div>
    </div>
  );
};

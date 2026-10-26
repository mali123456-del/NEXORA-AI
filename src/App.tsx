import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CommandPalette } from './components/CommandPalette';
import { TasksDrawer } from './components/TasksDrawer';
import { AuditLogModal } from './components/AuditLogModal';
import { DocViewerModal } from './components/DocViewerModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { AssistantView } from './components/ecosystems/AssistantView';
import { DevStudioView } from './components/ecosystems/DevStudioView';
import { EthicalHackingView } from './components/ecosystems/EthicalHackingView';
import { DefensiveSecurityView } from './components/ecosystems/DefensiveSecurityView';
import { AgentWorkforceView } from './components/ecosystems/AgentWorkforceView';
import { AutomationHubView } from './components/ecosystems/AutomationHubView';
import { CreatorStudioView } from './components/ecosystems/CreatorStudioView';
import { BusinessStudioView } from './components/ecosystems/BusinessStudioView';
import { MarketplaceView } from './components/ecosystems/MarketplaceView';
import { LearningAcademyView } from './components/ecosystems/LearningAcademyView';
import { DataIntelligenceView } from './components/ecosystems/DataIntelligenceView';
import { SmartWorkspaceView } from './components/ecosystems/SmartWorkspaceView';

import { EcosystemId, SubscriptionPlan, UserRoleProfile } from './types';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { EcosystemStatusProvider } from './context/EcosystemStatusContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState<EcosystemId>('assistant');
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('ULTIMATE');
  const [currentRole, setCurrentRole] = useState<UserRoleProfile>('developer');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);
  const [activeDocPath, setActiveDocPath] = useState<string | null>(null);

  const { toggleTheme } = useTheme();
  const { notify } = useNotification();

  const handleRoleChange = (role: UserRoleProfile) => {
    setCurrentRole(role);
    const roleRecommendations: Record<UserRoleProfile, { tab: EcosystemId; title: string }> = {
      everyday: { tab: 'assistant', title: 'Everyday Assistant & Creator focus activated' },
      developer: { tab: 'dev_studio', title: 'Developer Studio & SAST toolchain activated' },
      security: { tab: 'ethical_hacking', title: 'Ethical Hacking & Defensive Security suite activated' },
      business: { tab: 'business_studio', title: 'Business Strategy & Marketplace focus activated' },
    };

    const target = roleRecommendations[role];
    setActiveTab(target.tab);
    notify({
      type: 'info',
      title: 'Persona Changed',
      message: target.title,
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans transition-colors duration-150">
      {/* Top Application Header */}
      <Header
        currentPlan={currentPlan}
        setCurrentPlan={setCurrentPlan}
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenTasks={() => setIsTasksOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
      />

      {/* Main Body: Navigation Sidebar + Active Ecosystem View */}
      <div className="flex flex-1 overflow-hidden">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
          <ErrorBoundary resetKey={activeTab}>
            {activeTab === 'assistant' && <AssistantView />}
            {activeTab === 'dev_studio' && <DevStudioView />}
            {activeTab === 'ethical_hacking' && <EthicalHackingView />}
            {activeTab === 'defensive_sec' && <DefensiveSecurityView />}
            {activeTab === 'agent_workforce' && <AgentWorkforceView />}
            {activeTab === 'automation_hub' && <AutomationHubView />}
            {activeTab === 'creator_studio' && <CreatorStudioView />}
            {activeTab === 'business_studio' && <BusinessStudioView />}
            {activeTab === 'marketplace' && <MarketplaceView />}
            {activeTab === 'learning_academy' && <LearningAcademyView />}
            {activeTab === 'data_intel' && <DataIntelligenceView />}
            {activeTab === 'smart_workspace' && (
              <SmartWorkspaceView currentPlan={currentPlan} setCurrentPlan={setCurrentPlan} />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Modals & Drawers */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={tab => setActiveTab(tab)}
        onOpenTasks={() => setIsTasksOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        onOpenDoc={docPath => setActiveDocPath(docPath)}
        onToggleTheme={toggleTheme}
      />

      <TasksDrawer isOpen={isTasksOpen} onClose={() => setIsTasksOpen(false)} />

      <AuditLogModal isOpen={isAuditLogsOpen} onClose={() => setIsAuditLogsOpen(false)} />

      <DocViewerModal
        isOpen={Boolean(activeDocPath)}
        docPath={activeDocPath}
        onClose={() => setActiveDocPath(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <EcosystemStatusProvider>
          <AppContent />
        </EcosystemStatusProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

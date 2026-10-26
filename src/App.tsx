import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CommandPalette } from './components/CommandPalette';
import { TasksDrawer } from './components/TasksDrawer';
import { AuditLogModal } from './components/AuditLogModal';

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

import { EcosystemId, SubscriptionPlan } from './types';
import { NotificationProvider } from './context/NotificationContext';
import { EcosystemStatusProvider } from './context/EcosystemStatusContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<EcosystemId>('assistant');
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>('ULTIMATE');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  return (
    <NotificationProvider>
      <EcosystemStatusProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
        {/* Top Application Header */}
        <Header
          currentPlan={currentPlan}
          setCurrentPlan={setCurrentPlan}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenTasks={() => setIsTasksOpen(true)}
          onOpenAuditLogs={() => setIsAuditLogsOpen(true)}
        />

        {/* Main Body: Navigation Sidebar + Active Ecosystem View */}
        <div className="flex flex-1 overflow-hidden">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
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
          </main>
        </div>

        {/* Modals & Drawers */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTab={tab => setActiveTab(tab)}
        />

        <TasksDrawer isOpen={isTasksOpen} onClose={() => setIsTasksOpen(false)} />

        <AuditLogModal isOpen={isAuditLogsOpen} onClose={() => setIsAuditLogsOpen(false)} />
      </div>
      </EcosystemStatusProvider>
    </NotificationProvider>
  );
}


import React, { createContext, useContext, useState, useCallback } from 'react';
import { EcosystemId } from '../types';

export type EcosystemConnectivityState = 'online' | 'syncing' | 'offline';

interface EcosystemStatusContextType {
  statuses: Record<EcosystemId, EcosystemConnectivityState>;
  setEcosystemStatus: (id: EcosystemId, state: EcosystemConnectivityState, resetAfterMs?: number) => void;
  resetAllStatuses: () => void;
}

const defaultStates: Record<EcosystemId, EcosystemConnectivityState> = {
  assistant: 'online',
  dev_studio: 'online',
  creator_studio: 'online',
  business_studio: 'online',
  ethical_hacking: 'online',
  defensive_sec: 'online',
  agent_workforce: 'online',
  automation_hub: 'online',
  marketplace: 'online',
  learning_academy: 'online',
  data_intel: 'online',
  smart_workspace: 'online',
};

const EcosystemStatusContext = createContext<EcosystemStatusContextType | undefined>(undefined);

export const EcosystemStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statuses, setStatuses] = useState<Record<EcosystemId, EcosystemConnectivityState>>(defaultStates);

  const setEcosystemStatus = useCallback((id: EcosystemId, state: EcosystemConnectivityState, resetAfterMs?: number) => {
    setStatuses(prev => ({
      ...prev,
      [id]: state,
    }));

    if (resetAfterMs && resetAfterMs > 0) {
      setTimeout(() => {
        setStatuses(prev => ({
          ...prev,
          [id]: 'online',
        }));
      }, resetAfterMs);
    }
  }, []);

  const resetAllStatuses = useCallback(() => {
    setStatuses(defaultStates);
  }, []);

  return (
    <EcosystemStatusContext.Provider value={{ statuses, setEcosystemStatus, resetAllStatuses }}>
      {children}
    </EcosystemStatusContext.Provider>
  );
};

export const useEcosystemStatus = () => {
  const context = useContext(EcosystemStatusContext);
  if (!context) {
    throw new Error('useEcosystemStatus must be used within an EcosystemStatusProvider');
  }
  return context;
};

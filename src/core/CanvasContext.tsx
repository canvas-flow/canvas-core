import React, { createContext, useContext } from 'react';
import { CanvasConfig, ComponentRegistry } from '../types/schema';
import { InspectorOption } from '../types/inspector';

export type GroupActionType = 'create' | 'delete' | 'update' | 'move' | 'ungroup' | 'run' | 'save';

interface CanvasContextValue {
  config: CanvasConfig;
  components: ComponentRegistry;
  readOnly: boolean;
  onInspectorRequest?: (action: string, payload?: any) => Promise<InspectorOption[]>;
  onNodeRun?: (nodeId: string) => Promise<void>;
  onNodeDataChange?: (nodeId: string, data: any) => void;
  runningNodeId?: string | null;
  // The ID of the node that should display its inspector (usually the single selected node)
  inspectingNodeId?: string | null;
  // Global execution state (true if ANY execution is happening - single, group, or flow)
  isExecuting?: boolean;
  // New callback for Group operations
  onGroupAction?: (type: GroupActionType, payload: any) => void;
  // Global overlay state for mutex
  activeOverlay?: { nodeId: string; elementId: string } | null;
  setActiveOverlay?: (overlay: { nodeId: string; elementId: string } | null) => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export const CanvasProvider: React.FC<CanvasContextValue & { children: React.ReactNode }> = ({ 
  children, 
  ...value 
}) => {
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
};

import React, { useState, useRef, useImperativeHandle, useCallback } from 'react';
import { CanvasEditor } from './CanvasEditor';
import { FlowRunner } from './FlowRunner';
import { CanvasProvider, GroupActionType } from './CanvasContext';
import { CanvasFlowValue, CanvasFlowNode, CanvasFlowEdge, CanvasFlowGroup } from '../types/flow';
import { ExecutionConfig } from '../types/execution';
import { InspectorOption } from '../types/inspector';
import { CanvasConfig, ComponentRegistry } from '../types/schema';
import { generateId } from './utils';
import '../styles/canvas.css';

import { defaultCanvasConfig, defaultComponentRegistry } from './defaults';

export type CanvasMode = 'edit' | 'view';

export interface CanvasFlowUIOptions {
  showMinimap?: boolean;
  showGrid?: boolean;
  showToolbar?: boolean;
}

export interface CanvasFlowProps {
  initialFlow?: CanvasFlowValue;
  /** @deprecated Use config and components instead */
  nodeTypes?: any; 
  
  // New Props
  config?: CanvasConfig;
  components?: ComponentRegistry;

  execution?: ExecutionConfig;
  mode?: CanvasMode;
  ui?: CanvasFlowUIOptions;
  renderEmpty?: React.ReactNode;
  onChange?: (flow: CanvasFlowValue) => void;
  onSave?: (flow: CanvasFlowValue) => void;
  onRunFlow?: (flow: CanvasFlowValue) => void;
  onNodeRun?: (nodeId: string) => Promise<any>;
  onGroupRun?: (groupId: string) => Promise<any>;
  onSelectionChange?: (nodeIds: string[]) => void;
  onInspectorRequest?: (action: string, payload?: any) => Promise<InspectorOption[]>;
  
  // Granular Event Hooks (Callbacks)
  onNodeAdd?: (node: CanvasFlowNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeMove?: (node: CanvasFlowNode) => void;
  onNodeDataChange?: (nodeId: string, data: any) => void;
  onEdgeAdd?: (edge: CanvasFlowEdge) => void;
  onEdgeDelete?: (edgeId: string) => void;
  
  // Group Events
  onGroupAdd?: (group: CanvasFlowGroup) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupUpdate?: (group: Partial<CanvasFlowGroup> & { id: string }) => void;

  className?: string;
  style?: React.CSSProperties;
}

export interface CanvasFlowHandle {
  init(initialData?: CanvasFlowValue, flowId?: string): string;
  getFlow(): CanvasFlowValue;
  setFlow(flow: CanvasFlowValue): void;
  runFlow(): Promise<any>;
  fitView(): void;
  getViewport(): { x: number; y: number; zoom: number };
}

export const CanvasFlow = React.forwardRef<CanvasFlowHandle, CanvasFlowProps>((props, ref) => {
  const {
    initialFlow = { nodes: [], edges: [] },
    config = defaultCanvasConfig,
    components = defaultComponentRegistry,
    execution = {},
    mode = 'edit',
    ui = { showToolbar: true },
    renderEmpty,
    onChange,
    onSave,
    onRunFlow,
    onNodeRun,
    onGroupRun,
    onSelectionChange,
    onInspectorRequest,
    
    // Granular events
    onNodeAdd,
    onNodeDelete,
    onNodeMove,
    onNodeDataChange,
    onEdgeAdd,
    onEdgeDelete,
    
    // Group events
    onGroupAdd,
    onGroupDelete,
    onGroupUpdate,
    
    className,
    style
  } = props;

  void ui;
  void onSave;

  const [currentFlow, setCurrentFlow] = useState<CanvasFlowValue>(initialFlow);
  const [isRunning, setIsRunning] = useState(false);
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null);
  const [inspectingNodeId, setInspectingNodeId] = useState<string | null>(null);
  
  const runnerRef = useRef(new FlowRunner(execution));
  const editorRef = useRef<any>(null);
  const canvasIdRef = useRef<string>('');

  useImperativeHandle(ref, () => ({
    init: (initialData?: CanvasFlowValue, flowId?: string) => {
      const newId = flowId || generateId();
      canvasIdRef.current = newId;

      if (initialData) {
        setCurrentFlow(initialData);
        if (editorRef.current?.setFlow) {
          editorRef.current.setFlow(initialData);
          setTimeout(() => {
             editorRef.current?.fitView();
          }, 10);
        }
      }
      
      return newId;
    },
    getFlow: () => currentFlow,
    setFlow: (flow: CanvasFlowValue) => {
      setCurrentFlow(flow);
      if (editorRef.current?.setFlow) {
        editorRef.current.setFlow(flow);
      }
    },
    runFlow: async () => {
      return handleRunFlow();
    },
    fitView: () => {
      editorRef.current?.fitView();
    },
    getViewport: () => {
       return editorRef.current?.getViewport() || { x: 0, y: 0, zoom: 1 };
    }
  }));

  const handleFlowChange = useCallback((newFlow: CanvasFlowValue) => {
    setCurrentFlow(newFlow);
    onChange?.(newFlow);
  }, [onChange]);

  const handleSelectionChange = useCallback((nodeIds: string[]) => {
    // nodeIds only contains non-group nodes (filtered by CanvasEditor)
    if (nodeIds.length === 1) {
      setInspectingNodeId(nodeIds[0]);
    } else {
      setInspectingNodeId(null);
    }
    onSelectionChange?.(nodeIds);
  }, [onSelectionChange]);

  const handleRunFlow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    onRunFlow?.(currentFlow);
    
    try {
      const result = await runnerRef.current.runFlow(currentFlow, (nodeId: string, status: string) => {
        console.log(`Node ${nodeId} status: ${status}`);
      });
      console.log('Flow execution finished:', result);
      return result;
    } catch (err) {
      console.error('Flow execution failed', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleGroupRun = async (groupId: string) => {
    if (isRunning) return;

    if (onGroupRun) {
      setIsRunning(true);
      try {
        await onGroupRun(groupId);
      } catch (err) {
        console.error(`Group ${groupId} execution failed`, err);
      } finally {
        setIsRunning(false);
      }
      return;
    }
    
    const groupNodes = currentFlow.nodes.filter(n => n.groupId === groupId || n.data._groupId === groupId);
    if (groupNodes.length === 0) return;

    const groupNodeIds = new Set(groupNodes.map(n => n.id));
    const groupEdges = currentFlow.edges.filter(e => groupNodeIds.has(e.source) && groupNodeIds.has(e.target));
    
    const groupFlow: CanvasFlowValue = {
        nodes: groupNodes,
        edges: groupEdges,
        groups: [], 
        meta: currentFlow.meta
    };

    setIsRunning(true);
    try {
        const result = await runnerRef.current.runFlow(groupFlow, (nodeId: string, status: string) => {
            console.log(`[Group ${groupId}] Node ${nodeId} status: ${status}`);
        });
        console.log(`Group ${groupId} execution finished:`, result);
    } catch (err) {
        console.error(`Group ${groupId} execution failed`, err);
    } finally {
        setIsRunning(false);
    }
  };

  const handleNodeRun = async (nodeId: string) => {
    if (runningNodeId) return;
    
    setRunningNodeId(nodeId);
    try {
      if (onNodeRun) {
        await onNodeRun(nodeId);
      } else {
        console.warn('No onNodeRun handler provided');
      }
    } catch (err) {
      console.error('Node execution failed:', err);
    } finally {
      setRunningNodeId(null);
    }
  };

  // Dispatcher for Group Actions
  const handleGroupAction = useCallback((type: GroupActionType, payload: any) => {
    switch (type) {
      case 'create':
        onGroupAdd?.(payload);
        break;
      case 'delete':
        onGroupDelete?.(payload);
        break;
      case 'update':
      case 'move':
        onGroupUpdate?.(payload);
        break;
      case 'ungroup':
        if (editorRef.current?.ungroup) {
            editorRef.current.ungroup(payload.id);
        }
        break;
      case 'run':
        handleGroupRun(payload.id);
        break;
    }
  }, [onGroupAdd, onGroupDelete, onGroupUpdate, currentFlow, onGroupRun]); // Added onGroupRun to deps

  return (
    <CanvasProvider 
      config={config} 
      components={components} 
      readOnly={mode === 'view'}
      onInspectorRequest={onInspectorRequest}
      onNodeRun={handleNodeRun}
      onNodeDataChange={onNodeDataChange}
      runningNodeId={runningNodeId}
      isExecuting={isRunning || !!runningNodeId}
      onGroupAction={handleGroupAction}
      inspectingNodeId={inspectingNodeId}
    >
      <div className={`canvas-flow-container ${className || ''}`} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', ...style }}>
        <CanvasEditor
          ref={editorRef}
          initialFlow={initialFlow}
          readOnly={mode === 'view'}
          renderEmpty={renderEmpty}
          onChange={handleFlowChange}
          onSelectionChange={handleSelectionChange} 
          
          onNodeAdd={onNodeAdd}
          onNodeMove={onNodeMove}
          onNodeDelete={onNodeDelete}
          onNodeDataChange={onNodeDataChange}
          onEdgeAdd={onEdgeAdd}
          onEdgeDelete={onEdgeDelete}
          
          onGroupAdd={onGroupAdd}
          onGroupDelete={onGroupDelete}
          onGroupUpdate={onGroupUpdate}
        />
      </div>
    </CanvasProvider>
  );
});

CanvasFlow.displayName = 'CanvasFlow';
export default CanvasFlow;

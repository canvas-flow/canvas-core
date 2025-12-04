import { memo, useCallback, useRef, useEffect, useMemo } from 'react';
import { Handle, Position, NodeToolbar, NodeProps, useReactFlow, useEdges, useNodesData } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useCanvasContext } from './CanvasContext';
import { NodeInspectorPanel } from '../components/inspector/NodeInspectorPanel';
import { NodeContentProps } from '../types/schema';
import type { CanvasUpstreamNode } from '../types/flow';

function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

export const UniversalNode = memo((props: NodeProps) => {
  // Cast props to any to access style if it's not in the types yet, or extend NodeProps
  const { id, data, selected, style } = props as any; 
  const { 
    config, 
    components, 
    readOnly, 
    onInspectorRequest, 
    onNodeRun, 
    runningNodeId, 
    isExecuting, 
    onNodeDataChange,
    inspectingNodeId 
  } = useCanvasContext();
  const { setNodes, getNode } = useReactFlow();
  const edges = useEdges();

  // Log style prop to debug
  useEffect(() => {
    if (style && (style.width || style.height)) {
       console.log(`[UniversalNode] Rendered with style:`, style, 'id:', id);
    }
  }, [style, id]);

  // 1. 查找节点定义
  const nodeType = props.type || 'default';
  const definition = config.nodeDefinitions.find(def => def.type === nodeType);

  if (!definition) {
    return (
      <div style={{ padding: 10, border: '1px solid red', borderRadius: 4, background: '#fff0f0' }}>
        Unknown node type: {nodeType}
      </div>
    );
  }

  // 2. 查找内容渲染组件
  const ContentComponent = components[definition.component];
  
  // 3. Inspector 配置
  const inspectorConfig = definition.inspector;

  // Debounce the external sync to prevent API flooding
  const debouncedSync = useDebouncedCallback((nodeId: string, newData: any) => {
    if (onNodeDataChange) {
      onNodeDataChange(nodeId, newData);
    }
  }, 500);

  const handleNodeChange = (newData: any) => {
    // CRITICAL FIX: Merge current data with new data to ensure full data object is sent
    // Backend might overwrite the entire data object, so we must send everything.
    const fullData = { ...data, ...newData };

    // 1. Optimistic UI Update (Immediate)
    setNodes((nodes) => nodes.map((n) => {
      if (n.id === id) {
        return { ...n, data: fullData };
      }
      return n;
    }));
    
    // 2. Debounced Backend Sync (Send Full Data)
    debouncedSync(id, fullData);
  };

  const isConnected = edges.some(e => e.source === id || e.target === id);

  // 1. Get Upstream IDs
  const upstreamIds = useMemo(() => 
    edges.filter(edge => edge.target === id).map(edge => edge.source),
    [edges, id]
  );

  // 2. Subscribe to Upstream Data
  const upstreamNodesData = useNodesData(upstreamIds);

  // 3. Build Upstream Nodes List
  const upstreamNodes: CanvasUpstreamNode[] = useMemo(() => {
    if (!upstreamNodesData) return [];
    
    // Normalize single/array response
    const nodesArray = Array.isArray(upstreamNodesData) ? upstreamNodesData : [upstreamNodesData];
    
    return nodesArray.map((node: any) => {
      if (!node) return null;
      const upstreamDef = config.nodeDefinitions.find(def => def.type === node.type);
      return {
        id: node.id,
        type: node.type,
        label: upstreamDef?.label,
        data: node.data,
      } as CanvasUpstreamNode;
    }).filter((node): node is CanvasUpstreamNode => !!node);
  }, [upstreamNodesData, config.nodeDefinitions]);

  const contentProps: NodeContentProps = {
    nodeId: id,
    data: data,
    selected: !!selected,
    isConnected,
    onChange: handleNodeChange,
    onRun: onNodeRun ? () => onNodeRun(id) : undefined,
    style: style, // Pass style to content component
  };

  return (
    <div className={`canvas-node ${selected ? 'selected' : ''}`} style={{width: '100%', height: '100%'}}>
      {/* Node Toolbar / Inspector */}
      <NodeToolbar isVisible={id === inspectingNodeId && !readOnly} position={Position.Bottom}>
        <NodeInspectorPanel 
          node={{ id, type: nodeType, data, position: { x: 0, y: 0 } }} 
          onChange={handleNodeChange}
          config={inspectorConfig}
          onRequestOptions={onInspectorRequest}
          onRunNode={onNodeRun ? () => onNodeRun(id) : undefined}
          isRunning={runningNodeId === id}
          disabled={!!isExecuting}
          showInput={inspectorConfig?.showInput ?? true}
        upstreamNodes={upstreamNodes}
        />
      </NodeToolbar>

      {/* Label */}
      <div className="canvas-node-label">
        {definition.label}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Left} className="canvas-handle" />
      
      {/* Content Body */}
      <div className="canvas-node-body" style={{ position: 'relative' }}>
        {ContentComponent ? (
          <ContentComponent {...contentProps} />
        ) : (
          <div style={{ padding: 10 }}>Missing Component: {definition.component}</div>
        )}

        {/* GLOBAL LOADING OVERLAY */}
        {/* Safety check: If node has content (src/output), don't show loading even if status says running. 
            This prevents UI from getting stuck in loading state if status update fails or is delayed,
            but we have the result. */}
        {data._executionStatus === 'running' && !data.src && !data.output && (
            <div className="cf-upload-loading-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 20, color: '#fff', gap: 8, borderRadius: 'inherit'
            }}>
                <Loader2 className="cf-spinner" size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{fontSize: 12}}>Running...</span>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="canvas-handle" />
    </div>
  );
});

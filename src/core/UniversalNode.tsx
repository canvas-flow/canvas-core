import { memo, useCallback, useRef, useEffect, useMemo, useState } from 'react';
import { Handle, Position, NodeToolbar, NodeProps, useReactFlow, useEdges, useNodesData } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import { useCanvasContext } from './CanvasContext';
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
    onNodeRun, 
    runningNodeId, 
    isExecuting, 
    onNodeDataChange,
    inspectingNodeId,
    mediaMap,
    mediaEmitter,
    updateNodeMedia,
    renderNodeInspector
  } = useCanvasContext();
  const { setNodes, getNode } = useReactFlow();
  const edges = useEdges();
  
  // 订阅媒体数据更新
  // 初始化时从 mediaMap 获取，如果没有则使用 props.data
  const [nodeMedia, setNodeMedia] = useState(() => {
    const mediaFromMap = mediaMap.get(id);
    if (mediaFromMap && Object.keys(mediaFromMap).length > 0) {
      return mediaFromMap;
    }
    // 降级：使用 props.data（向后兼容）
    return data || {};
  });
  
  useEffect(() => {
    const handler = (updatedMedia: any) => {
      setNodeMedia(updatedMedia);
    };
    mediaEmitter.on(id, handler);
    return () => mediaEmitter.off(id, handler);
  }, [id, mediaEmitter]);


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

  // Debounce the external sync to prevent API flooding
  const debouncedSync = useDebouncedCallback((nodeId: string, newData: any) => {
    if (onNodeDataChange) {
      onNodeDataChange(nodeId, newData);
    }
  }, 500);

  const handleNodeChange = (newData: any) => {
    // 1. Update local nodeMedia state immediately (UI responds instantly)
    setNodeMedia(prev => ({ ...prev, ...newData }));
    
    // 2. Notify external (debounced sync to backend)
    debouncedSync(id, newData);
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
    data: { ...data, ...nodeMedia }, // 合并结构数据和媒体数据
    selected: !!selected,
    isConnected,
    onChange: handleNodeChange,
    onRun: onNodeRun ? () => onNodeRun(id) : undefined,
    style: style, // Pass style to content component
  };

  return (
    <div className={`canvas-node ${selected ? 'selected' : ''}`} style={{width: '100%', height: '100%'}}>
      {/* Node Toolbar / Inspector (Render Props pattern) */}
      {renderNodeInspector && (
        <NodeToolbar isVisible={id === inspectingNodeId && !readOnly} position={Position.Bottom}>
          {renderNodeInspector({
            nodeId: id,
            node: {
              id,
              type: nodeType,
              position: { x: 0, y: 0 },
              data: nodeMedia,
            }
          })}
        </NodeToolbar>
      )}

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
        {(nodeMedia._loading || nodeMedia._executionStatus === 'running') && !nodeMedia.src && !nodeMedia.output && (
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

        {/* GLOBAL ERROR OVERLAY */}
        {nodeMedia._error && (
            <div className="cf-node-error-overlay" style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(220, 38, 38, 0.9)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 20, color: '#fff', gap: 8, borderRadius: 'inherit', padding: 12
            }}>
                <span style={{fontSize: 14, fontWeight: 600}}>⚠️ Error</span>
                <span style={{fontSize: 12, textAlign: 'center', wordBreak: 'break-word'}}>{nodeMedia._error}</span>
            </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="canvas-handle" />
    </div>
  );
});

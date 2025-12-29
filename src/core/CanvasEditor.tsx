import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  NodeChange,
  EdgeChange,
  Node,
  Edge
} from '@xyflow/react';
import { Copy, Clipboard, Trash2, FolderInput, Group } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import { CanvasFlowValue, CanvasFlowNode, CanvasFlowEdge, CanvasFlowGroup } from '../types/flow';
import { toReactFlowNodes, toReactFlowEdges, fromReactFlowNodes, fromReactFlowEdges, generateId, getBounds } from './utils';
import { FloatingNodeMenu } from '../components/FloatingNodeMenu';
import { ContextMenu, ContextMenuItem } from '../components/ContextMenu';
import { useCanvasContext } from './CanvasContext';
import { UniversalNode } from './UniversalNode';
import { GroupNode } from '../components/nodes/GroupNode';
import { SelectionMenu } from '../components/SelectionMenu';
import { useCanvasConnection } from './hooks/useCanvasConnection';

interface CanvasEditorProps {
  initialFlow?: CanvasFlowValue;
  readOnly?: boolean;
  onChange?: (flow: CanvasFlowValue) => void;
  onSelectionChange?: (nodeIds: string[]) => void;
  renderEmpty?: React.ReactNode;
  
  onNodeAdd?: (node: CanvasFlowNode) => void;
  onNodeMove?: (node: CanvasFlowNode) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeDataChange?: (nodeId: string, data: any) => void;
  onEdgeAdd?: (edge: CanvasFlowEdge) => void;
  onEdgeDelete?: (edgeId: string) => void;

  onGroupAdd?: (group: CanvasFlowGroup) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupUngroup?: (groupId: string, nodeIds: string[]) => void;
  onGroupUpdate?: (group: Partial<CanvasFlowGroup> & { id: string }) => void;
}

export const CanvasEditor = React.forwardRef<any, CanvasEditorProps>(({
  initialFlow,
  readOnly = false,
  onChange,
  onSelectionChange,
  renderEmpty,
  onNodeAdd,
  onNodeMove,
  onNodeDelete,
  onNodeDataChange: _onNodeDataChange,
  onEdgeAdd,
  onEdgeDelete,
  onGroupAdd,
  onGroupDelete,
  onGroupUngroup,
  onGroupUpdate,
}, _ref) => {
  const { config, onNodeDataChange, getNodeContextMenuItems, getNodeMedia } = useCanvasContext();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [rfInstance, setRfInstance] = useState<any>(null);

  const {
    isConnecting,
    connectionMenu,
    setConnectionMenu,
    isValidConnection,
    onConnect,
    onConnectStart,
    onConnectEnd,
    handleMenuAddNode,
    availableNodeTypes
  } = useCanvasConnection({
    nodes,
    edges,
    setEdges,
    setNodes,
    onEdgeAdd,
    onNodeAdd,
    config,
    rfInstance
  });

  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    type: 'node' | 'edge' | 'pane' | 'multi' | 'group';
    targetId?: string;
  } | null>(null);

  const [clipboard, setClipboard] = useState<Node | null>(null);
  const [mousePosition, setMousePosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Init Data
  useEffect(() => {
    if (initialFlow) {
      setNodes(toReactFlowNodes(initialFlow.nodes, initialFlow.groups));
      setEdges(toReactFlowEdges(initialFlow.edges));
    }
  }, []);

  // Sync Changes
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (onChangeRef.current) {
      const { nodes: canvasNodes, groups: canvasGroups } = fromReactFlowNodes(nodes);
      const flowValue: CanvasFlowValue = {
        nodes: canvasNodes,
        edges: fromReactFlowEdges(edges),
        groups: canvasGroups
      };
      onChangeRef.current(flowValue);
    }
  }, [nodes, edges]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const reactFlowNodeTypes = useMemo(() => {
    const types: Record<string, any> = {
      group: GroupNode,
    };
    config.nodeDefinitions.forEach((def) => {
      types[def.type] = UniversalNode;
    });
    return types;
  }, [config.nodeDefinitions]);

  // Handlers
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    changes.forEach(change => {
      if (change.type === 'remove' && onNodeDelete) {
        onNodeDelete(change.id);
      }
    });
  }, [onNodesChange, onNodeDelete]);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    changes.forEach(change => {
      if (change.type === 'remove' && onEdgeDelete) {
        onEdgeDelete(change.id);
      }
    });
  }, [onEdgesChange, onEdgeDelete]);

  const onSelectionChangeInternal = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    if (selectedNodes.length > 0) {
      const first = selectedNodes[0];
      if (first.type !== 'group') {
        setSelectedNodeId(first.id);
      } else {
        setSelectedNodeId(null);
      }
    } else {
      setSelectedNodeId(null);
    }

    if (onSelectionChange) {
      // Only notify about real nodes selection
      const realNodes = selectedNodes.filter(n => n.type !== 'group');
      onSelectionChange(realNodes.map(n => n.id));
    }
  }, [onSelectionChange]);

  // REMOVED: dragRef, onNodeDragStart, onNodeDrag (Native Dragging)

  const handleNodeDragStop = useCallback((_event: React.MouseEvent, node: Node, _nodes: Node[]) => {
    if (node.type === 'group') {
        if (onGroupUpdate) {
            onGroupUpdate({ id: node.id, position: node.position });
        }
        // No need to update children positions as they are now stored relatively
        return;
    }
    
    if (onNodeMove) {
      // We trust fromReactFlowNodes to handle whether to save relative or absolute
      // based on parentId presence.
      const { nodes: convertedNodes } = fromReactFlowNodes(nodes); 
      const target = convertedNodes.find(n => n.id === node.id);
      if (target) {
          onNodeMove(target);
      }
    }
  }, [onNodeMove, onGroupUpdate, nodes]);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (event.detail === 2 && !readOnly) {
      setConnectionMenu({
        isOpen: true,
        position: { x: event.clientX, y: event.clientY },
        source: null
      });
    }
    setContextMenu(null);
  }, [readOnly]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      type: node.type === 'group' ? 'group' : 'node',
      targetId: node.id,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    const selectedNodes = nodes.filter(n => n.selected && n.type !== 'group');
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      type: selectedNodes.length > 1 ? 'multi' : 'pane',
    });
  }, [nodes]);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      type: 'edge',
      targetId: edge.id,
    });
  }, []);

  // --- Group Actions ---
  const handleCreateGroup = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected && n.type !== 'group');
    if (selectedNodes.length === 0) return;

    // 1. Prepare absolute positions snapshot to calculate correct bounds/relative pos
    const { nodes: absNodes } = fromReactFlowNodes(nodes);
    const absNodeMap = new Map(absNodes.map(n => [n.id, n]));

    // 2. Collect involved old groups
    const involvedGroupIds = new Set<string>();
    selectedNodes.forEach(n => {
        if (n.data._groupId) {
            involvedGroupIds.add(n.data._groupId as string);
        }
    });

    // 3. Collect all members (selected + others from involved groups)
    const newGroupNodesMap = new Map<string, CanvasFlowNode>();
    selectedNodes.forEach(n => {
        const absN = absNodeMap.get(n.id);
        if (absN) newGroupNodesMap.set(n.id, absN);
    });

    if (involvedGroupIds.size > 0) {
        absNodes.forEach(n => {
            if (n.groupId && involvedGroupIds.has(n.groupId) && n.type !== 'group') {
                newGroupNodesMap.set(n.id, n);
            }
        });
    }

    const finalMemberNodes = Array.from(newGroupNodesMap.values());

    // Improve bounds calculation by using measured dimensions from state
    const approximateBounds = getBounds(finalMemberNodes.map(n => ({
      position: n.position,
      width: 200,
      height: 100
    })));
    
    const stateNodeMap = new Map(nodes.map(n => [n.id, n]));
    const boundsWithSize = getBounds(finalMemberNodes.map(n => {
        const stateNode = stateNodeMap.get(n.id);
        return {
            position: n.position,
            width: stateNode?.measured?.width || stateNode?.width,
            height: stateNode?.measured?.height || stateNode?.height
        };
    }));
    const hasSizeInfo = finalMemberNodes.some(n => {
        const stateNode = stateNodeMap.get(n.id);
        return !!(stateNode?.measured || stateNode?.width || stateNode?.height);
    });
    const boundsWithDims = hasSizeInfo ? boundsWithSize : approximateBounds;

    const padding = 20;
    const groupId = generateId('group');
    const newGroup: CanvasFlowGroup = {
      id: groupId,
      label: '新建分组',
      position: { x: boundsWithDims.x - padding, y: boundsWithDims.y - padding },
      width: boundsWithDims.width + padding * 2,
      height: boundsWithDims.height + padding * 2,
    };

    if (onGroupAdd) onGroupAdd(newGroup);
    
    // Delete merged groups
    involvedGroupIds.forEach(oldGid => {
        if (onGroupDelete) onGroupDelete(oldGid);
    });

    // Create Group Node
    const groupNode: Node = {
        id: groupId,
        type: 'group',
        position: newGroup.position,
        width: newGroup.width,
        height: newGroup.height,
        zIndex: -1,
        data: { label: newGroup.label, _isGroup: true },
        style: { width: newGroup.width, height: newGroup.height, zIndex: -1 },
        selected: true
    };

    setNodes(nds => {
      // Remove merged group nodes
      let remainingNodes = nds.filter(n => n.type !== 'group' || !involvedGroupIds.has(n.id));
      
      // Update members
      const updatedNodes = remainingNodes.map(n => {
        if (newGroupNodesMap.has(n.id)) {
          if (onNodeDataChange) {
             onNodeDataChange(n.id, { ...n.data, _groupId: groupId });
          }
          
          // Get absolute position from snapshot
          const absN = absNodeMap.get(n.id);
          const absX = absN?.position.x ?? n.position.x;
          const absY = absN?.position.y ?? n.position.y;

          return {
            ...n,
            parentId: groupId, // NEW: Parent/Child linkage
            expandParent: false, // Prevent child drag from resizing group
            position: {
                x: absX - newGroup.position.x,
                y: absY - newGroup.position.y
            },
            selected: false,
            data: { ...n.data, _groupId: groupId }
          };
        }
        return n;
      });
      // CRITICAL FIX: Parent node (group) MUST be before children in the array
      // for React Flow to handle relative positioning and events correctly.
      return [groupNode, ...updatedNodes];
    });
    
    setContextMenu(null);
  }, [nodes, setNodes, onGroupAdd, onGroupDelete, onNodeDataChange]);

  const handleUngroup = useCallback((groupId?: string) => {
    const targetId = groupId || contextMenu?.targetId || nodes.find(n => n.selected && n.type === 'group')?.id;
    if (!targetId) return;

    // Prepare absolute positions
    const { nodes: absNodes } = fromReactFlowNodes(nodes);
    const absNodeMap = new Map(absNodes.map(n => [n.id, n]));

    // 收集分组内的节点 ID
    const nodesInGroup = nodes.filter(n => n.data?._groupId === targetId || n.parentId === targetId);
    const nodeIds = nodesInGroup.map(n => n.id);

    // ✅ 调用 onGroupUngroup 而不是 onGroupDelete
    if (onGroupUngroup) {
        onGroupUngroup(targetId, nodeIds);
    }

    setNodes(nds => {
        const filtered = nds.filter(n => n.id !== targetId);
        return filtered.map(n => {
            if (n.data?._groupId === targetId || n.parentId === targetId) {
                if (onNodeDataChange) {
                    onNodeDataChange(n.id, { ...n.data, _groupId: undefined });
                }
                
                // Restore absolute position
                const absN = absNodeMap.get(n.id);
                const absX = absN?.position.x ?? n.position.x;
                const absY = absN?.position.y ?? n.position.y;

                return { 
                    ...n, 
                    parentId: undefined,
                    position: { x: absX, y: absY },
                    data: { ...n.data, _groupId: undefined } 
                };
            }
            return n;
        });
    });

    setContextMenu(null);
  }, [contextMenu, nodes, setNodes, onGroupUngroup, onNodeDataChange]);

  // --- Standard Actions ---
  const handleCopy = useCallback(() => {
    let targetId = contextMenu?.type === 'node' ? contextMenu.targetId : null;
    if (!targetId && selectedNodeId) targetId = selectedNodeId;

    if (targetId) {
      const node = nodes.find(n => n.id === targetId);
      if (node) setClipboard(node);
    }
  }, [contextMenu, nodes, selectedNodeId]);

  const handlePaste = useCallback(() => {
    if (clipboard && rfInstance) {
      let position;
      if (contextMenu) {
        position = rfInstance.screenToFlowPosition({ x: contextMenu.position.x, y: contextMenu.position.y });
      } else {
        position = rfInstance.screenToFlowPosition({ x: mousePosition.x, y: mousePosition.y });
      }
      const newNodeId = generateId();
      const newNode = {
        ...clipboard,
        id: newNodeId,
        position,
        selected: true,
        data: { ...clipboard.data, _groupId: undefined }
      };
      setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));
      setSelectedNodeId(newNodeId);
      if (onNodeAdd) {
        const [canvasNode] = fromReactFlowNodes([newNode]).nodes;
        onNodeAdd(canvasNode);
      }
    }
  }, [clipboard, rfInstance, contextMenu, mousePosition, setNodes, onNodeAdd]);

  const handleDelete = useCallback(() => {
    let targetId: string | undefined;
    let isEdge = false;
    let isGroup = false;

    if (contextMenu) {
        targetId = contextMenu.targetId;
        isEdge = contextMenu.type === 'edge';
        isGroup = contextMenu.type === 'group';
    } else {
        const selectedNode = nodes.find(n => n.selected);
        const selectedEdge = edges.find(e => e.selected);
        if (selectedNode) {
            targetId = selectedNode.id;
            isGroup = selectedNode.type === 'group';
        } else if (selectedEdge) {
            targetId = selectedEdge.id;
            isEdge = true;
        }
    }

    if (!targetId) return;

    if (isEdge) {
        setEdges(eds => eds.filter(e => e.id !== targetId));
        if (onEdgeDelete) onEdgeDelete(targetId);
    } else {
        if (isGroup) {
            // 删除分组：只调用 onGroupDelete，由 demo 层处理级联删除
            // ⚠️ 注意：不要为每个节点单独调用 onNodeDelete，避免发送多余的请求
            if (onGroupDelete) {
                onGroupDelete(targetId);
            }
            
            // 本地状态更新：移除分组和分组内的节点
            const nodesInGroup = nodes.filter(n => n.parentId === targetId || n.data?._groupId === targetId);
            const nodeIdsToDelete = nodesInGroup.map(n => n.id);
            
            setNodes(nds => nds.filter(n => n.id !== targetId && !nodeIdsToDelete.includes(n.id)));
            
            // 删除相关的边
            setEdges(eds => eds.filter(e => 
                !nodeIdsToDelete.includes(e.source) && !nodeIdsToDelete.includes(e.target)
            ));
        } else {
            setNodes(nds => nds.filter(n => n.id !== targetId));
            setEdges(eds => eds.filter(e => e.source !== targetId && e.target !== targetId));
            if (onNodeDelete) onNodeDelete(targetId);
        }
    }
    setContextMenu(null);
  }, [contextMenu, nodes, edges, setNodes, setEdges, onNodeDelete, onEdgeDelete, onGroupDelete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (readOnly) return;
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.getAttribute('contenteditable') === 'true')) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') handleCopy();
      else if ((event.ctrlKey || event.metaKey) && event.key === 'v') handlePaste();
      else if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        handleCreateGroup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy, handlePaste, handleCreateGroup, readOnly]);

  const contextMenuItems: ContextMenuItem[] = useMemo(() => {
    const items: ContextMenuItem[] = [];

    const isEdgeContext = contextMenu?.type === 'edge';

    if (contextMenu?.type === 'multi') {
      items.push({
        label: '创建分组 (Group)',
        onClick: handleCreateGroup,
        icon: <FolderInput size={16} />,
        shortcut: 'Ctrl+G'
      });
    }

    if (contextMenu?.type === 'node' || contextMenu?.type === 'edge') {
      items.push({
        label: '复制 (Copy)',
        onClick: handleCopy,
        disabled: contextMenu.type !== 'node',
        icon: <Copy size={16} />,
        shortcut: 'Ctrl+C'
      });
    }
    
    if (contextMenu?.type === 'pane' || contextMenu?.type === 'node') {
        items.push({
            label: '粘贴 (Paste)',
            onClick: handlePaste,
            disabled: !clipboard || isEdgeContext,
            icon: <Clipboard size={16} />,
            shortcut: 'Ctrl+V'
        });
    }

    items.push({
      label: '删除 (Delete)',
      onClick: handleDelete,
      icon: <Trash2 size={16} />,
      shortcut: 'Del'
    });
    
    if (contextMenu?.type === 'group') {
        items.push({
            label: '解散分组 (Ungroup)',
            onClick: handleUngroup,
            icon: <Group size={16} />,
        });
    }

    // 🔥 添加自定义菜单项（仅节点右键菜单）
    if (contextMenu?.type === 'node' && contextMenu.targetId && getNodeContextMenuItems) {
      const targetNode = nodes.find(n => n.id === contextMenu.targetId);
      if (targetNode) {
        // 从 ReactFlow 节点转换为 CanvasFlowNode
        const { nodes: canvasNodes } = fromReactFlowNodes(nodes);
        const canvasNode = canvasNodes.find(n => n.id === contextMenu.targetId);
        
        if (canvasNode) {
          const mediaData = getNodeMedia(contextMenu.targetId);
          const customItems = getNodeContextMenuItems(contextMenu.targetId, canvasNode, mediaData);
          
          if (customItems.length > 0) {
            // 添加分隔线效果（通过空项或在 UI 中处理）
            customItems.forEach(item => {
              items.push({
                label: item.label,
                onClick: item.onClick,
                disabled: item.disabled,
                icon: item.icon,
              });
            });
          }
        }
      }
    }

    return items;
  }, [contextMenu, clipboard, handleCopy, handlePaste, handleDelete, handleCreateGroup, handleUngroup, nodes, getNodeContextMenuItems, getNodeMedia]);

  React.useImperativeHandle(_ref, () => ({
    fitView: () => rfInstance?.fitView(),
    getViewport: () => rfInstance?.getViewport(),
    setFlow: (flow: CanvasFlowValue) => {
      setNodes(toReactFlowNodes(flow.nodes, flow.groups));
      setEdges(toReactFlowEdges(flow.edges));
    },
    ungroup: (groupId: string) => handleUngroup(groupId)
  }), [rfInstance, setNodes, setEdges, handleUngroup]);

  return (
    <div 
      className={`canvas-flow-wrapper ${isConnecting ? 'is-connecting' : ''}`}
      style={{ backgroundColor: config.style?.background }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeDragStop={handleNodeDragStop}
        isValidConnection={isValidConnection}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onInit={setRfInstance}
        nodeTypes={reactFlowNodeTypes}
        onSelectionChange={onSelectionChangeInternal}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionKeyCode={['Shift']}
        noPanClassName="nopan"
      >
        <Background />
        <SelectionMenu 
            selectedNodes={nodes.filter(n => n.selected && n.type !== 'group')} 
            onCreateGroup={handleCreateGroup}
        />
        <Controls />
        {nodes.length === 0 && renderEmpty && (
          <div className="cf-empty-state-overlay">{renderEmpty}</div>
        )}
      </ReactFlow>

      {connectionMenu.isOpen && (
        <FloatingNodeMenu 
          position={connectionMenu.position}
          onAddNode={handleMenuAddNode}
          availableTypes={availableNodeTypes}
          onClose={() => setConnectionMenu(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {contextMenu?.isOpen && (
        <ContextMenu
          items={contextMenuItems}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
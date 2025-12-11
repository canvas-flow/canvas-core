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
  const { config, onNodeDataChange } = useCanvasContext();
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
  
  // Store group metadata (label, style) separately
  const groupsRef = useRef<CanvasFlowGroup[]>([]);
  
  // Flag to prevent onChange callback when setFlow is called programmatically
  const isInternalUpdateRef = useRef(false);
  
  // Init Data
  useEffect(() => {
    if (initialFlow) {
      setNodes(toReactFlowNodes(initialFlow.nodes, initialFlow.groups));
      setEdges(toReactFlowEdges(initialFlow.edges));
      groupsRef.current = initialFlow.groups || [];
    }
  }, []);

  // Sync Changes
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    // Skip onChange callback if this is an internal update from setFlow
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    
    if (onChangeRef.current) {
      const { nodes: canvasNodes, groups: canvasGroups } = fromReactFlowNodes(nodes, groupsRef.current);
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
      if (change.type === 'remove') {
        // 检查是否是分组节点
        const node = nodes.find(n => n.id === change.id);
        if (node?.type === 'group') {
          // 分组节点：调用 onGroupDelete
          if (onGroupDelete) {
            onGroupDelete(change.id);
          }
        } else {
          // 普通节点：调用 onNodeDelete
          if (onNodeDelete) {
            onNodeDelete(change.id);
          }
        }
      }
    });
  }, [onNodesChange, onNodeDelete, onGroupDelete, nodes]);

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

  const handleNodeDragStop = useCallback((_event: React.MouseEvent, node: Node, allNodes: Node[]) => {
    // 1. 处理编组节点拖动
    if (node.type === 'group') {
        if (onGroupUpdate) {
            // ✅ 保存编组的位置和尺寸（measured 是 ReactFlow 测量的实际尺寸）
            onGroupUpdate({ 
              id: node.id, 
              position: node.position,
              width: node.measured?.width || node.width,
              height: node.measured?.height || node.height
            });
        }
        return;
    }
    
    // 2. 处理普通节点拖动
    if (onNodeMove) {
      // We trust fromReactFlowNodes to handle whether to save relative or absolute
      // based on parentId presence.
      const { nodes: convertedNodes } = fromReactFlowNodes(allNodes, groupsRef.current); 
      const target = convertedNodes.find(n => n.id === node.id);
      if (target) {
          onNodeMove(target);
      }
    }
    
    // 3. ✅ 新增：如果拖动的节点属于编组，同时更新编组尺寸
    // 因为 expandParent 会自动扩大编组，我们需要保存新的尺寸
    if (node.parentId && onGroupUpdate) {
        const groupNode = allNodes.find(n => n.id === node.parentId);
        if (groupNode && groupNode.measured) {
            // 只有当编组有 measured 尺寸时才更新（说明尺寸已经变化）
            onGroupUpdate({
              id: groupNode.id,
              position: groupNode.position,
              width: groupNode.measured.width,
              height: groupNode.measured.height
            });
            console.log(`[编组自动扩展] 保存编组 ${groupNode.id} 的新尺寸:`, {
              width: groupNode.measured.width,
              height: groupNode.measured.height
            });
        }
    }
  }, [onNodeMove, onGroupUpdate, nodes, groupsRef]);

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
    const { nodes: absNodes } = fromReactFlowNodes(nodes, groupsRef.current);
    const absNodeMap = new Map(absNodes.map(n => [n.id, n]));

    // 2. Collect involved old groups
    const involvedGroupIds = new Set<string>();
    selectedNodes.forEach(n => {
        if (n.parentId) {
            involvedGroupIds.add(n.parentId as string);
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
    
    // Update groupsRef to preserve label and style
    groupsRef.current = [...groupsRef.current.filter(g => !involvedGroupIds.has(g.id)), newGroup];
    
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
        data: {}, // ReactFlow requires data field
        style: { width: newGroup.width, height: newGroup.height, zIndex: -1 },
        selected: true,
        draggable: true // Ensure group is draggable
    };

    setNodes(nds => {
      // Remove merged group nodes
      let remainingNodes = nds.filter(n => n.type !== 'group' || !involvedGroupIds.has(n.id));
      
      // Update members - 保留节点的所有数据
      const updatedNodes = remainingNodes.map(n => {
        if (newGroupNodesMap.has(n.id)) {
          // Get absolute position from snapshot
          const absN = absNodeMap.get(n.id);
          const absX = absN?.position.x ?? n.position.x;
          const absY = absN?.position.y ?? n.position.y;

          return {
            ...n, // 保留节点的所有属性（包括 width, height, measured 等）
            parentId: groupId,
            extent: 'parent' as const,
            expandParent: true,
            draggable: true,
            position: {
                x: absX - newGroup.position.x,
                y: absY - newGroup.position.y
            },
            selected: false,
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
    const { nodes: absNodes } = fromReactFlowNodes(nodes, groupsRef.current);
    const absNodeMap = new Map(absNodes.map(n => [n.id, n]));

    // 收集编组内的节点ID
    const nodeIdsInGroup = nodes.filter(n => n.parentId === targetId).map(n => n.id);
    
    // 通知上层解组（保留节点，只移除分组）
    if (onGroupUngroup) {
        onGroupUngroup(targetId, nodeIdsInGroup);
    }
    
    // Remove group from groupsRef
    groupsRef.current = groupsRef.current.filter(g => g.id !== targetId);

    setNodes(nds => {
        const filtered = nds.filter(n => n.id !== targetId);
        return filtered.map(n => {
                if (n.parentId === targetId) {
                // Restore absolute position
                const absN = absNodeMap.get(n.id);
                const absX = absN?.position.x ?? n.position.x;
                const absY = absN?.position.y ?? n.position.y;

                return { 
                    ...n, // 保留节点的所有属性（包括 width, height, measured 等）
                    parentId: undefined,
                    position: { x: absX, y: absY },
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
        data: {}, // ReactFlow requires data field
      };
      setNodes((nds) => nds.map(n => ({ ...n, selected: false })).concat(newNode));
      setSelectedNodeId(newNodeId);
      if (onNodeAdd) {
        const [canvasNode] = fromReactFlowNodes([newNode], groupsRef.current).nodes;
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
            // 删除分组：删除分组节点和其内部的所有节点
            setNodes(nds => nds.filter(n => {
                // 删除分组本身
                if (n.id === targetId) return false;
                // 删除分组内的子节点
                if (n.parentId === targetId) return false;
                return true;
            }));
            
            // 同时删除相关连线
            setEdges(eds => eds.filter(e => {
                const sourceInGroup = nodes.find(n => 
                    n.id === e.source && (n.id === targetId || n.parentId === targetId)
                );
                const targetInGroup = nodes.find(n => 
                    n.id === e.target && (n.id === targetId || n.parentId === targetId)
                );
                return !sourceInGroup && !targetInGroup;
            }));
            
            // 通知上层删除分组（会级联删除组内节点和连线）
            if (onGroupDelete) onGroupDelete(targetId);
            
            // ❌ 不需要单独调用 onNodeDelete，onGroupDelete 会处理级联删除
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
            onClick: () => handleUngroup(contextMenu.targetId),
            icon: <Group size={16} />,
        });
    }

    return items;
  }, [contextMenu, clipboard, handleCopy, handlePaste, handleDelete, handleCreateGroup, handleUngroup]);

  React.useImperativeHandle(_ref, () => ({
    fitView: () => rfInstance?.fitView(),
    getViewport: () => rfInstance?.getViewport(),
    setFlow: (flow: CanvasFlowValue) => {
      // Mark as internal update to skip onChange callback
      isInternalUpdateRef.current = true;
      setNodes(toReactFlowNodes(flow.nodes, flow.groups));
      setEdges(toReactFlowEdges(flow.edges));
      groupsRef.current = flow.groups || [];
    },
    getFlow: () => {
      // 从 ReactFlow 的实时状态转换回 CanvasFlowValue
      const { nodes: canvasNodes, groups: canvasGroups } = fromReactFlowNodes(nodes, groupsRef.current);
      const canvasEdges = fromReactFlowEdges(edges);
      return {
        nodes: canvasNodes,
        edges: canvasEdges,
        groups: canvasGroups
      };
    },
    ungroup: (groupId: string) => handleUngroup(groupId)
  }), [rfInstance, setNodes, setEdges, handleUngroup, nodes, edges]);

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
import { Node, Edge, MarkerType } from '@xyflow/react';
import { CanvasFlowNode, CanvasFlowEdge, CanvasFlowGroup } from '../types/flow';

export const generateId = (prefix: string = 'node'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const toReactFlowNodes = (nodes: CanvasFlowNode[], groups: CanvasFlowGroup[] = []): Node[] => {
  // 1. Create group lookup map
  const groupMap = new Map(groups.map(g => [g.id, g]));

  // 2. Convert nodes (calculate relative position)
  const flowNodes = nodes.map((node) => {
    // Compatibility: groupId or data._groupId
    const groupId = node.groupId || node.data?._groupId;
    const group = groupId ? groupMap.get(groupId as string) : undefined;
    
    let position = node.position;
    let parentId = undefined;

    if (group) {
      parentId = group.id;
      // Check if stored as relative (runtime flag)
      if (node.data?._isRelative) {
          position = node.position; // Already relative
      } else {
          // Legacy Absolute -> Relative
          position = {
            x: node.position.x - group.position.x,
            y: node.position.y - group.position.y
          };
      }
    }

    return {
      id: node.id,
      type: node.type,
      position: position,
      parentId: parentId, // Set parent ID for React Flow parent-child relationship
      extent: parentId ? ('parent' as const) : undefined, // Keep children within parent bounds
      expandParent: true, // Allow group to resize when dragging children
      draggable: true, // Ensure nodes are draggable
      zIndex: 10,
      width: node.width,
      height: node.height,
      style: { 
          width: node.width ? `${node.width}px` : undefined,
          height: node.height ? `${node.height}px` : undefined
      },
      data: {
        ...node.data,
        _kind: node.type,
        _groupId: groupId, // Keep data ref
        _isRelative: !!parentId, // Mark as relative in runtime
      },
    };
  });

  // 3. Convert group nodes
  const groupNodes = groups.map((group) => ({
    id: group.id,
    type: 'group',
    position: group.position,
    zIndex: -1,
    draggable: true, // Ensure groups can be dragged
    width: group.width,
    height: group.height,
    data: {
      label: group.label,
      style: group.style,
      _isGroup: true
    },
    style: {
      width: group.width,
      height: group.height,
    }
  }));

  // Ensure Group nodes are rendered first
  return [...groupNodes, ...flowNodes];
};

export const fromReactFlowNodes = (nodes: Node[]): { nodes: CanvasFlowNode[], groups: CanvasFlowGroup[] } => {
  const canvasNodes: CanvasFlowNode[] = [];
  const canvasGroups: CanvasFlowGroup[] = [];
  
  // Create node lookup for finding parents
  nodes.forEach(node => {
    if (node.type === 'group' || node.data?._isGroup) {
      canvasGroups.push({
        id: node.id,
        label: node.data.label as string || 'Group',
        position: node.position,
        width: node.measured?.width || node.width || 200,
        height: node.measured?.height || node.height || 100,
        style: node.data.style as any
      });
    } else {
      // Handle standard nodes
      let position = node.position;
      const parentId = node.parentId;
      
      // If it has parent, position is already relative in ReactFlow.
      // We KEEP it relative for storage if it's a child node.
      
      canvasNodes.push({
        id: node.id,
        type: (node.data?._kind as string) || node.type || 'default',
        position: position, // Save relative position if child, absolute if root
        width: node.width,
        height: node.height,
        data: { 
            ...node.data, 
            _kind: undefined, 
            _groupId: undefined, 
            _isGroup: undefined,
            _isRelative: !!parentId // Mark persistence flag
        } as any,
        groupId: parentId, // Map parentId back to groupId
      });
    }
  });

  return { nodes: canvasNodes, groups: canvasGroups };
};

export const toReactFlowEdges = (edges: CanvasFlowEdge[]): Edge[] => {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    data: edge.data,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#888',
    },
  }));
};

export const fromReactFlowEdges = (edges: Edge[]): CanvasFlowEdge[] => {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    data: edge.data as any,
  }));
};

export const getBounds = (nodes: { position: { x: number, y: number }, width?: number, height?: number }[]) => {
  if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const w = node.width || 200;
    const h = node.height || 40;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + w);
    maxY = Math.max(maxY, node.position.y + h);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

interface SimpleNode { id: string; }
interface SimpleEdge { source: string; target: string; }

export const checkIsDag = (
  nodes: SimpleNode[],
  edges: SimpleEdge[],
  newConnection: { source: string; target: string }
): boolean => {
  const { source, target } = newConnection;
  if (source === target) return false;

  const adjacency = new Map<string, string[]>();
  nodes.forEach(node => adjacency.set(node.id, []));
  edges.forEach(edge => {
    const targets = adjacency.get(edge.source) || [];
    targets.push(edge.target);
    adjacency.set(edge.source, targets);
  });

  const visited = new Set<string>();
  const stack = [target];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === source) return false;
    if (!visited.has(current)) {
      visited.add(current);
      const neighbors = adjacency.get(current) || [];
      for (const neighbor of neighbors) {
        stack.push(neighbor);
      }
    }
  }
  return true;
};

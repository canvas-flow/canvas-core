import type { NodeData } from './nodeData';

export type CanvasNodeKind = 'text' | 'image' | 'audio' | 'video' | string;

export interface CanvasFlowNode {
  id: string;
  type: CanvasNodeKind;
  position: { x: number; y: number };
  data: NodeData;
  /** 所属编组 ID */
  groupId?: string;
  /** 节点宽度 */
  width?: number;
  /** 节点高度 */
  height?: number;
}

export interface CanvasFlowEdge {
  id: string;
  source: string;
  target: string;
  targetHandle?: string | null;
  sourceHandle?: string | null;
  data?: Record<string, any>;
}

export interface CanvasUpstreamNode {
  id: string;
  type: CanvasNodeKind;
  label?: string;
  data: NodeData;
}

export interface CanvasFlowMeta {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface CanvasFlowGroup {
  id: string;
  label: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  style?: {
    backgroundColor?: string;
    color?: string;
  };
}

export interface CanvasFlowValue {
  nodes: CanvasFlowNode[];
  edges: CanvasFlowEdge[];
  /** 编组列表 */
  groups?: CanvasFlowGroup[];
  meta?: CanvasFlowMeta;
}

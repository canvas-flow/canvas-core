import type { CanvasFlowNode, CanvasUpstreamNode } from './flow';
import type { InspectorConfig, InspectorOption } from './inspector';

/** 标准节点类型枚举 */
export enum StandardNodeType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  UPLOAD = 'user-upload',
}

export interface NodeRendererProps {
  node: CanvasFlowNode;
  selected: boolean;
  isConnected: boolean;
  onChange: (data: Record<string, any>) => void;
}

export interface NodeInspectorProps {
  node: CanvasFlowNode;
  onChange: (nextData: Record<string, any>) => void;
  /** 面板配置结构（功能区/设置区） */
  config?: InspectorConfig;
  /** 请求动态选项的回调 */
  onRequestOptions?: (action: string, payload?: any) => Promise<InspectorOption[]>;
  /** 是否显示输入区（默认为 true） */
  showInput?: boolean;
  /** 当前节点的一层上游节点快照 */
  upstreamNodes?: CanvasUpstreamNode[];
}

export interface NodeTypeConfig {
  /** 节点类型的标识，例如 'text', 'image' */
  type: string;
  /** 显示名称，例如 '文本生成', '图片生成' */
  label: string;
  /** 节点主体渲染组件 */
  renderNode: React.ComponentType<NodeRendererProps>;
  /** 属性面板渲染组件（可选） */
  renderInspector?: React.ComponentType<NodeInspectorProps>;
  /** 属性面板配置（数据驱动模式 - 对应 API 返回） */
  inspectorConfig?: InspectorConfig;
  /** 前端静态配置：是否显示输入区 */
  showInput?: boolean;
  /** 新建节点时的默认 data */
  defaultData?: () => Record<string, any>;
}

export type NodeTypeRegistry = Record<string, NodeTypeConfig>;

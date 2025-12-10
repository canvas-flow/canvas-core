
import React from 'react';

// 节点内容组件的 Props 标准
export interface NodeContentProps {
  nodeId: string;
  data: any;
  selected: boolean;
  isConnected: boolean;
  // 允许组件修改节点数据
  onChange: (newData: any) => void; 
  // 允许组件触发运行
  onRun?: () => void;
  // 节点样式（可选），用于传递尺寸等信息
  style?: React.CSSProperties;
}

// 节点定义 (JSON)
export interface NodeDefinition {
  /** 节点类型唯一标识，如 'llm-text' */
  type: string;
  /** 节点显示名称 */
  label: string;
  
  /** 
   * 内容区渲染配置 
   * 指向注册表中的 key
   */
  component: string; 
  
  /** 初始数据 */
  defaultData?: Record<string, any>;
  
  /** UI 配置 */
  width?: number;
  height?: number;

  /** 连接规则配置 */
  connectionRules?: NodeConnectionRules;
}

export interface NodeConnectionRules {
  /** 允许连接到此节点的上游节点类型列表 (Left/Input) */
  allowedSources?: string[];
  /** 允许此节点连接到的下游节点类型列表 (Right/Output) */
  allowedTargets?: string[];
}

// 全局配置 (JSON)
export interface CanvasConfig {
  /** 定义所有可用的节点类型 */
  nodeDefinitions: NodeDefinition[];
  /** 样式配置 */
  style?: {
    background?: string; // 具体的颜色值或 CSS 变量
  };
}

// 组件注册表 (Code)
export type ComponentRegistry = Record<string, React.ComponentType<NodeContentProps>>;


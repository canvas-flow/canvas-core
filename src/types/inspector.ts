
export type InspectorItemType = 'select' | 'toggle' | 'button' | 'input' | 'number' | 'textarea';

export interface InspectorOption {
  label: string;
  value: string | number | boolean;
  /** 选项图标 (对应 lucide-react) */
  icon?: string;
  description?: string;
  
  /** 
   * 动作标识。
   * 用于当选中该选项时触发特定行为（例如向后端请求进一步的数据，或者作为标识符使用）
   */
  action?: string;

  /** 如果设置，则只有当所有上游节点的类型都包含在该列表时才展示此选项 */
  allowedUpstreamTypes?: string[];
  
  /** 注入到功能区（顶部工具栏）的字段 */
  functional?: InspectorItem[];
  /** 注入到设置区（底部表单）的字段 */
  settings?: InspectorItem[];
}

export interface InspectorItem {
  /** 唯一标识符，也作为 data 中的 key。支持嵌套字段，如 'params.model' */
  field: string;
  /** UI 显示类型 */
  type: InspectorItemType;
  /** 显示标签 */
  label?: string;
  /** 图标名称 (对应 lucide-react) */
  icon?: string;
  /** 提示文本 */
  tooltip?: string;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 是否只读 */
  readOnly?: boolean;
  
  // --- Select/Action 相关 ---
  /** 
   * 动作标识。
   * 如果设置了 action，点击时会触发 onAction/onRequestOptions
   * 而不是直接显示静态 options 
   */
  action?: string;
  
  /** 静态选项列表 */
  options?: InspectorOption[];
}

export interface InspectorConfig {
  /** 节点类型 */
  nodeType?: string;
  /** 是否显示输入区（prompt） */
  showInput?: boolean;
  /** 顶部功能区（图标按钮、下拉等） */
  functional: InspectorItem[];
  /** 底部设置区（表单）- 作为通用兜底配置 */
  settings: InspectorItem[];
}

/** 
 * 请求 Inspector 配置的回调
 * @param nodeType 节点类型
 * @param context 上下文信息（节点数据、场景等）
 * @returns Inspector 配置
 */
export type OnRequestInspectorConfig = (
  nodeType: string, 
  context?: { nodeId?: string; nodeData?: any; mode?: string }
) => Promise<InspectorConfig>;

/** 节点通用数据参数 */
export interface NodeParams {
  /** 使用的模型 */
  model?: string;
  /** 模型库来源 (如 openai, anthropic 等) */
  provider?: string;
  /** 资源比例 (如 16:9, 1:1) */
  aspectRatio?: string;
  /** 资源大小 (如 1024x1024) */
  imageSize?: string;
  /** 是否启用 Google 搜索 */
  enableGoogleSearch?: boolean;
  /** 分辨率/决定参数 */
  resolution?: string;
}

/** 节点数据基础结构 */
export interface NodeData {
  /** 资源地址 */
  src?: string;
  /** 模型提示词 */
  prompt?: string;
  /** 节点标题 */
  title?: string;
  /** 资源类型 (如 image/png, video/mp4) - 避免与 node.type 混淆 */
  resourceType?: string;
  /** 模型参数配置 */
  params?: NodeParams;
  
  // 现有字段保持兼容
  /** 文本内容 (TextNode) */
  text?: string;
  /** 输出结果 */
  output?: string;
  /** 是否已交互 */
  isInteracted?: boolean;
  
  // 允许扩展其他字段
  [key: string]: any;
}


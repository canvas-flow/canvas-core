# Canvas Core 类型定义参考

Core 层暴露的主要类型定义。

## 核心接口

### CanvasFlowHandle

`CanvasFlow` 组件通过 `ref` 暴露的 API 句柄。

```typescript
interface CanvasFlowHandle {
  // ========== Flow 管理 ==========
  createFlow(initialData?: CanvasFlowValue): string;
  getFlow(): CanvasFlowValue;
  setFlow(flow: CanvasFlowValue): void;
  runFlow(): Promise<void>;
  
  // ========== 节点查询 ==========
  getNode(nodeId: string): Node | null;
  getUpstreamNodes(nodeId: string): UpstreamNode[];
  
  // ========== 媒体内容管理（推荐） ==========
  setNodeImage(nodeId: string, src: string): void;
  setNodeVideo(nodeId: string, src: string): void;
  setNodeAudio(nodeId: string, src: string): void;
  setNodeText(nodeId: string, text: string): void;
  setNodeOutput(nodeId: string, outputData: any): void;
  
  setNodeContent(nodeId: string, content: Record<string, any>): void;
  clearNodeContent(nodeId: string): void;
  
  // ========== 状态管理 ==========
  setNodeLoading(nodeId: string): void;
  clearNodeLoading(nodeId: string): void;
  setNodeError(nodeId: string, error: string): void;
  clearNodeError(nodeId: string): void;
  
  // ========== 视图控制 ==========
  fitView(): void;
  getViewport(): { x: number; y: number; zoom: number };
  
  // ========== 兼容性 API（不推荐） ==========
  updateNodeMedia(nodeId: string, media: any): void;
  batchUpdateNodeMedia(updates: Array<{ nodeId: string; data: any }>): void;
  getNodeMedia(nodeId: string): any;
  updateNodeStatus(nodeId: string, status: 'running' | 'idle'): void;
}
```

---

### CanvasFlowProps

`CanvasFlow` 组件的 Props。

```typescript
interface CanvasFlowProps {
  // ========== 核心配置 ==========
  config: CanvasConfig;                    // 画布配置
  components: ComponentRegistry;            // 组件注册表
  execution?: ExecutionContext;             // 执行上下文
  
  // ========== 渲染自定义 ==========
  renderEmpty?: React.ReactNode;            // 空状态渲染
  renderNodeInspector?: (props: {          // Inspector 渲染（Render Props）
    nodeId: string;
    node: Node;
  }) => React.ReactNode;
  
  // ========== 事件回调 ==========
  onChange?: (flow: CanvasFlowValue) => void;
  onRunFlow?: () => void;
  onNodeRun?: (nodeId: string) => void;
  onGroupRun?: (groupId: string) => void;
  onGroupSave?: (groupId: string) => void;
  
  onNodeAdd?: (node: Node) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeMove?: (node: Node) => void;
  onNodeDataChange?: (nodeId: string, data: any) => void;
  
  onEdgeAdd?: (edge: Edge) => void;
  onEdgeDelete?: (edgeId: string) => void;
  
  onGroupAdd?: (group: Group, nodeIds?: string[]) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupUpdate?: (group: Group) => void;
}
```

---

### CanvasFlowValue

Flow 的完整数据结构。

```typescript
interface CanvasFlowValue {
  nodes: Node[];      // 节点数组
  edges: Edge[];      // 连线数组
  groups?: Group[];   // 编组数组（可选）
}
```

---

### Node

节点数据结构（基于 React Flow）。

```typescript
interface Node {
  id: string;                    // 节点唯一 ID
  type: string;                  // 节点类型
  position: { x: number; y: number };  // 位置
  data?: Record<string, any>;    // 节点数据（包含媒体内容）
  
  width?: number;                // 宽度（可选）
  height?: number;               // 高度（可选）
  groupId?: string;              // 所属编组 ID（可选）
  
  // React Flow 内部字段
  selected?: boolean;
  dragging?: boolean;
  // ...
}
```

---

### Edge

连线数据结构。

```typescript
interface Edge {
  id: string;                    // 连线唯一 ID
  source: string;                // 源节点 ID
  target: string;                // 目标节点 ID
  sourceHandle?: string;         // 源连接点 ID
  targetHandle?: string;         // 目标连接点 ID
  data?: Record<string, any>;    // 连线数据（可选）
  type?: string;                 // 连线类型（可选）
}
```

---

### Group

编组数据结构。

```typescript
interface Group {
  id: string;                    // 编组唯一 ID
  label: string;                 // 编组名称
  position: { x: number; y: number };  // 位置
  width: number;                 // 宽度
  height: number;                // 高度
  color?: string;                // 颜色（可选）
}
```

---

### UpstreamNode

上游节点信息（`getUpstreamNodes` 返回值）。

```typescript
interface UpstreamNode {
  id: string;                    // 节点 ID
  type: string;                  // 节点类型
  label: string;                 // 节点显示名称
  position: { x: number; y: number };  // 节点位置
  data: Record<string, any>;     // 节点媒体数据
}
```

---

## 配置类型

### CanvasConfig

画布配置。

```typescript
interface CanvasConfig {
  nodeDefinitions: NodeDefinition[];      // 节点定义数组
  // ... 其他配置
}
```

---

### NodeDefinition

节点定义（用于配置可用节点类型）。

```typescript
interface NodeDefinition {
  type: string;                  // 节点类型（唯一标识）
  label: string;                 // 显示名称
  description?: string;          // 描述（可选）
  category?: string;             // 分类（可选）
  icon?: string;                 // 图标（可选）
  defaultData?: Record<string, any>;  // 默认数据（可选）
  
  // Core 层不再包含 inspector 配置
  // inspector 配置由 Demo 层管理
}
```

---

### StandardNodeType

标准节点类型枚举。

```typescript
enum StandardNodeType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  UPLOAD = 'user-upload',
  // ... 其他类型
}
```

---

## 媒体数据类型

### NodeMediaData

节点的媒体数据（存储在 `mediaMapRef` 中）。

```typescript
interface NodeMediaData {
  // ========== 媒体内容字段（白名单） ==========
  src?: string;                  // 媒体 URL（图片/视频/音频）
  text?: string;                 // 文本内容
  outputData?: any;              // 输出数据
  fileName?: string;             // 文件名
  fileType?: string;             // 文件类型（MIME）
  responseData?: any;            // 响应数据
  
  // ========== UI 状态字段（内部使用） ==========
  _loading?: boolean;            // 加载状态
  _error?: string;               // 错误信息
  _contentSize?: {               // 内容尺寸（内部）
    width: number;
    height: number;
  };
  
  // 其他非白名单字段会被过滤
}
```

**注意:**
- ✅ 白名单字段：`src`, `text`, `outputData`, `fileName`, `fileType`, `responseData`
- ⚠️ UI 状态字段（`_` 开头）：仅供 Core 内部使用
- ❌ 其他字段：会被自动过滤并输出警告

---

## 组件类型

### ComponentRegistry

组件注册表。

```typescript
type ComponentRegistry = Record<string, React.ComponentType<any>>;

// 示例
const registry: ComponentRegistry = {
  'text': TextNodeComponent,
  'image': ImageNodeComponent,
  'video': VideoNodeComponent,
  // ...
};
```

---

### ExecutionContext

执行上下文（用于节点执行）。

```typescript
interface ExecutionContext {
  runNode: (ctx: NodeExecutionContext) => Promise<any>;
  // ... 其他执行相关方法
}

interface NodeExecutionContext {
  node: Node;
  upstreamData: any[];
  // ... 其他上下文信息
}
```

---

## 使用示例

### 完整的类型定义使用

```typescript
import { 
  CanvasFlow, 
  CanvasFlowHandle, 
  CanvasFlowProps,
  CanvasFlowValue,
  Node,
  StandardNodeType 
} from '@canvas-flow/core';

// 1. 创建 ref
const flowRef = useRef<CanvasFlowHandle>(null);

// 2. 类型安全的 Inspector 渲染
const renderNodeInspector: CanvasFlowProps['renderNodeInspector'] = 
  useCallback(({ nodeId, node }) => {
    const upstreamNodes = flowRef.current?.getUpstreamNodes(nodeId) || [];
    
    return (
      <InspectorPanel
        nodeId={nodeId}
        nodeType={node.type}
        upstreamNodes={upstreamNodes}
      />
    );
  }, []);

// 3. 类型安全的节点操作
const handleExecuteNode = async (nodeId: string) => {
  const node: Node | null = flowRef.current?.getNode(nodeId) || null;
  
  if (!node) {
    console.error('节点不存在');
    return;
  }
  
  // 根据节点类型调用对应 API
  if (node.type === StandardNodeType.IMAGE) {
    flowRef.current?.setNodeImage(nodeId, imageUrl);
  } else if (node.type === StandardNodeType.VIDEO) {
    flowRef.current?.setNodeVideo(nodeId, videoUrl);
  }
};

// 4. 类型安全的 Flow 操作
const handleSaveFlow = () => {
  const flow: CanvasFlowValue = flowRef.current?.getFlow() || {
    nodes: [],
    edges: []
  };
  
  // 保存到后端
  api.saveFlow(flow);
};
```

---

## 类型导入路径

```typescript
// 从主包导入
import { 
  CanvasFlow,
  CanvasFlowHandle,
  CanvasFlowProps,
  CanvasFlowValue,
  CanvasConfig,
  StandardNodeType
} from '@canvas-flow/core';

// 如果需要更多类型
import type { Node, Edge, Group } from '@canvas-flow/core';
```

---

## 🔗 相关文档

- [API 文档](./API.md)
- [API 速查表](./API-CHEATSHEET.md)





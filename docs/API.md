# Canvas Core - API 文档

> **版本**: 2.0  
> **最后更新**: 2025-12-09

本文档详细说明 `@canvas-flow/core` 包对外暴露的所有 API 函数。

---

## 📋 目录

- [Flow 管理](#flow-管理)
- [节点查询](#节点查询)
- [媒体内容管理](#媒体内容管理)
- [状态管理](#状态管理)
- [视图控制](#视图控制)
- [兼容性 API](#兼容性-api)

---

## Flow 管理

### `createFlow(initialData?: CanvasFlowValue): string`

创建一个新的 Flow 实例。

**参数:**
- `initialData` (可选): 初始的 Flow 数据，包含节点、连线、编组等

**返回值:**
- `string`: 新创建的 Flow ID

**示例:**
```typescript
const flowId = flowRef.current.createFlow({
  nodes: [],
  edges: [],
  groups: []
});
```

---

### `getFlow(): CanvasFlowValue`

获取当前 Flow 的完整数据（包含媒体数据）。

**返回值:**
- `CanvasFlowValue`: Flow 的完整数据结构，包括：
  - `nodes`: 节点数组（包含合并后的媒体数据）
  - `edges`: 连线数组
  - `groups`: 编组数组

**示例:**
```typescript
const flow = flowRef.current.getFlow();
console.log('当前画布有', flow.nodes.length, '个节点');
```

**注意:**
- 该方法会自动合并 `mediaMapRef` 中的媒体数据到 `node.data`
- 返回的是实时数据，非快照

---

### `setFlow(flow: CanvasFlowValue): void`

设置/替换整个 Flow 的数据。

**参数:**
- `flow`: 完整的 Flow 数据结构

**示例:**
```typescript
flowRef.current.setFlow({
  nodes: [...],
  edges: [...],
  groups: [...]
});
```

---

### `runFlow(): Promise<void>`

执行整个 Flow（触发所有节点的执行）。

**返回值:**
- `Promise<void>`: 执行完成的 Promise

**示例:**
```typescript
await flowRef.current.runFlow();
```

---

## 节点查询

### `getNode(nodeId: string): Node | null`

获取指定节点的信息。

**参数:**
- `nodeId`: 节点 ID

**返回值:**
- `Node | null`: 节点对象，如果不存在则返回 `null`

**示例:**
```typescript
const node = flowRef.current.getNode('node-123');
if (node) {
  console.log('节点类型:', node.type);
  console.log('节点位置:', node.position);
}
```

---

### `getUpstreamNodes(nodeId: string): UpstreamNode[]`

获取指定节点的所有上游节点信息。

**参数:**
- `nodeId`: 目标节点 ID

**返回值:**
- `UpstreamNode[]`: 上游节点数组，每个元素包含：
  - `id`: 节点 ID
  - `type`: 节点类型
  - `label`: 节点显示名称
  - `position`: 节点位置
  - `data`: 节点的媒体数据

**示例:**
```typescript
const upstreamNodes = flowRef.current.getUpstreamNodes('node-video');
upstreamNodes.forEach(node => {
  console.log('上游节点:', node.label, '输出数据:', node.data);
});
```

---

## 媒体内容管理

### 🌟 专用方法（推荐使用）

这些方法提供**类型安全**和**参数验证**，是 AI 编程时代的首选 API。

#### `setNodeImage(nodeId: string, src: string): void`

设置图片节点的图片 URL。

**参数:**
- `nodeId`: 节点 ID
- `src`: 图片 URL

**适用节点类型:**
- `image`
- `video`
- `audio`
- `user-upload`

**示例:**
```typescript
flowRef.current.setNodeImage('node-img-1', 'https://example.com/image.jpg');
```

**特性:**
- ✅ 自动验证节点类型
- ✅ 只接受 `src` 参数，防止参数错误
- ✅ 字段白名单保护

---

#### `setNodeVideo(nodeId: string, src: string): void`

设置视频节点的视频 URL。

**参数:**
- `nodeId`: 节点 ID
- `src`: 视频 URL

**适用节点类型:**
- `video`

**示例:**
```typescript
flowRef.current.setNodeVideo('node-video-1', 'https://example.com/video.mp4');
```

---

#### `setNodeAudio(nodeId: string, src: string): void`

设置音频节点的音频 URL。

**参数:**
- `nodeId`: 节点 ID
- `src`: 音频 URL

**适用节点类型:**
- `audio`

**示例:**
```typescript
flowRef.current.setNodeAudio('node-audio-1', 'https://example.com/audio.mp3');
```

---

#### `setNodeText(nodeId: string, text: string): void`

设置文本节点的文本内容。

**参数:**
- `nodeId`: 节点 ID
- `text`: 文本内容

**适用节点类型:**
- `text`

**示例:**
```typescript
flowRef.current.setNodeText('node-text-1', 'Hello, World!');
```

---

#### `setNodeOutput(nodeId: string, outputData: any): void`

设置节点的输出数据（通用）。

**参数:**
- `nodeId`: 节点 ID
- `outputData`: 输出数据（任意类型）

**适用节点类型:**
- 所有节点类型

**示例:**
```typescript
flowRef.current.setNodeOutput('node-1', {
  result: 'success',
  data: { ... }
});
```

---

### 🔧 通用方法

#### `setNodeContent(nodeId: string, content: Record<string, any>): void`

设置节点的任意媒体内容（通用方法）。

**参数:**
- `nodeId`: 节点 ID
- `content`: 内容对象（键值对）

**白名单字段:**
- `src` - 媒体 URL
- `text` - 文本内容
- `outputData` - 输出数据
- `fileName` - 文件名
- `fileType` - 文件类型
- `responseData` - 响应数据

**示例:**
```typescript
flowRef.current.setNodeContent('node-1', {
  src: 'https://example.com/media.jpg',
  fileName: 'image.jpg',
  fileType: 'image/jpeg'
});
```

**⚠️ 注意:**
- 非白名单字段会被自动过滤并输出警告
- 推荐优先使用专用方法（`setNodeImage` 等）

---

#### `clearNodeContent(nodeId: string): void`

清空节点的媒体内容，但保留 UI 状态（如 `_loading`、`_error`）。

**参数:**
- `nodeId`: 节点 ID

**示例:**
```typescript
flowRef.current.clearNodeContent('node-1');
```

---

## 状态管理

### `setNodeLoading(nodeId: string): void`

设置节点为加载状态（显示 loading 动画）。

**参数:**
- `nodeId`: 节点 ID

**示例:**
```typescript
// 开始执行
flowRef.current.setNodeLoading('node-1');

// 执行完成后清除
flowRef.current.clearNodeLoading('node-1');
```

---

### `clearNodeLoading(nodeId: string): void`

清除节点的加载状态。

**参数:**
- `nodeId`: 节点 ID

---

### `setNodeError(nodeId: string, error: string): void`

设置节点的错误状态（显示错误信息）。

**参数:**
- `nodeId`: 节点 ID
- `error`: 错误信息文本

**示例:**
```typescript
try {
  await executeNode(nodeId);
} catch (error) {
  flowRef.current.setNodeError(nodeId, error.message);
}
```

---

### `clearNodeError(nodeId: string): void`

清除节点的错误状态。

**参数:**
- `nodeId`: 节点 ID

---

## 视图控制

### `fitView(): void`

自动调整画布视图，使所有节点可见。

**示例:**
```typescript
flowRef.current.fitView();
```

---

### `getViewport(): { x: number, y: number, zoom: number }`

获取当前画布的视口信息。

**返回值:**
- `x`: 视口 X 偏移量
- `y`: 视口 Y 偏移量
- `zoom`: 缩放比例

**示例:**
```typescript
const viewport = flowRef.current.getViewport();
console.log('当前缩放:', viewport.zoom);
```

---

## 兼容性 API

以下 API 保留用于向后兼容，**不推荐**在新代码中使用。

### `updateNodeMedia(nodeId: string, media: any): void`

⚠️ **已废弃，请使用专用方法**

更新节点的媒体数据（旧版通用方法）。

**替代方案:**
- 使用 `setNodeImage/Video/Audio/Text/Output` 等专用方法

---

### `batchUpdateNodeMedia(updates: Array<{ nodeId: string; data: any }>): void`

⚠️ **已废弃**

批量更新多个节点的媒体数据。

---

### `getNodeMedia(nodeId: string): any`

获取节点的媒体数据。

**参数:**
- `nodeId`: 节点 ID

**返回值:**
- 节点的媒体数据对象

**示例:**
```typescript
const media = flowRef.current.getNodeMedia('node-1');
console.log('节点媒体数据:', media);
```

---

### `updateNodeStatus(nodeId: string, status: 'running' | 'idle'): void`

⚠️ **已废弃，请使用 `setNodeLoading/clearNodeLoading`**

更新节点的执行状态。

**替代方案:**
```typescript
// 旧方式
flowRef.current.updateNodeStatus(nodeId, 'running');

// 新方式
flowRef.current.setNodeLoading(nodeId);
```

---

## 📊 API 分类总览

### 🟢 推荐使用（语义化、类型安全）
- `setNodeImage`
- `setNodeVideo`
- `setNodeAudio`
- `setNodeText`
- `setNodeOutput`
- `setNodeLoading` / `clearNodeLoading`
- `setNodeError` / `clearNodeError`
- `getNode`
- `getUpstreamNodes`

### 🟡 谨慎使用（通用方法）
- `setNodeContent` - 当专用方法无法满足时使用
- `getNodeMedia` - 获取媒体数据时使用

### 🔴 不推荐（兼容性 API）
- `updateNodeMedia` - 请使用专用方法
- `batchUpdateNodeMedia` - 请逐个调用专用方法
- `updateNodeStatus` - 请使用 `setNodeLoading`

---

## 💡 最佳实践

### 1. 优先使用专用方法
```typescript
// ✅ 好的做法
flowRef.current.setNodeImage(nodeId, imageUrl);
flowRef.current.setNodeText(nodeId, text);

// ❌ 不推荐
flowRef.current.updateNodeMedia(nodeId, { src: imageUrl });
```

### 2. 使用状态管理 API
```typescript
// ✅ 完整的执行流程
flowRef.current.setNodeLoading(nodeId);

try {
  const result = await executeNode(nodeId);
  flowRef.current.setNodeOutput(nodeId, result);
  flowRef.current.clearNodeLoading(nodeId);
} catch (error) {
  flowRef.current.clearNodeLoading(nodeId);
  flowRef.current.setNodeError(nodeId, error.message);
}
```

### 3. 查询节点信息前验证
```typescript
const node = flowRef.current.getNode(nodeId);
if (!node) {
  console.warn('节点不存在:', nodeId);
  return;
}

// 使用节点信息
if (node.type === 'image') {
  flowRef.current.setNodeImage(nodeId, newImageUrl);
}
```

### 4. 获取上游数据
```typescript
const upstreamNodes = flowRef.current.getUpstreamNodes(nodeId);
const inputData = upstreamNodes.map(n => n.data);

// 基于上游数据执行当前节点
const result = await processNode(inputData);
flowRef.current.setNodeOutput(nodeId, result);
```

---

## 🔒 安全特性

### 字段白名单保护
所有媒体内容设置方法都会经过白名单验证：

```typescript
// 只有以下字段会被接受
const WHITELIST = [
  'src',
  'text',
  'outputData',
  'fileName',
  'fileType',
  'responseData'
];

// 非白名单字段会被过滤
flowRef.current.setNodeContent(nodeId, {
  src: 'ok',           // ✅ 接受
  text: 'ok',          // ✅ 接受
  customField: 'no'    // ❌ 忽略 + 警告
});
```

### 类型验证
专用方法会自动验证节点类型：

```typescript
// 如果 node-1 不是 video 类型
flowRef.current.setNodeVideo('node-1', videoUrl);
// ⚠️ 输出警告: "[setNodeVideo] 节点 node-1 类型不匹配，预期 video，实际 image"
```

---

## 📚 相关文档

- [架构设计文档](./ARCHITECTURE.md)
- [重构计划](./REFACTOR_PLAN.md)
- [类型定义](../src/types/)

---

**维护者**: Canvas Core Team  
**反馈**: 如有问题请提交 Issue











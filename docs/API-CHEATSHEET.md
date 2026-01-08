# Canvas Core API 速查表

快速查找常用 API 函数。

## 📦 导入

```typescript
import { CanvasFlow, CanvasFlowHandle } from '@canvas-flow/core';

const flowRef = useRef<CanvasFlowHandle>(null);
```

---

## 🎯 常用操作

### Flow 管理
```typescript
// 创建 Flow
const flowId = flowRef.current.createFlow({ nodes: [], edges: [] });

// 获取完整数据
const flow = flowRef.current.getFlow();

// 设置完整数据
flowRef.current.setFlow(flowData);
```

### 节点查询
```typescript
// 获取单个节点
const node = flowRef.current.getNode(nodeId);

// 获取上游节点
const upstreamNodes = flowRef.current.getUpstreamNodes(nodeId);
```

---

## 🖼️ 媒体内容设置

### 图片
```typescript
flowRef.current.setNodeImage(nodeId, 'https://example.com/image.jpg');
```

### 视频
```typescript
flowRef.current.setNodeVideo(nodeId, 'https://example.com/video.mp4');
```

### 音频
```typescript
flowRef.current.setNodeAudio(nodeId, 'https://example.com/audio.mp3');
```

### 文本
```typescript
flowRef.current.setNodeText(nodeId, 'Hello World');
```

### ~~输出数据~~ （已弃用）
```typescript
flowRef.current.setNodeOutput(nodeId, { result: 'success', data: {...} });
```

### ~~通用内容~~（内部实现）
```typescript
flowRef.current.setNodeContent(nodeId, {
  src: 'url',
  fileName: 'file.jpg',
  fileType: 'image/jpeg'
});
```

### 清空内容
```typescript
flowRef.current.clearNodeContent(nodeId);
```

---

## ⏳ 状态管理

### Loading 状态
```typescript
// 开始加载
flowRef.current.setNodeLoading(nodeId);

// 清除加载
flowRef.current.clearNodeLoading(nodeId);
```

### 错误状态
```typescript
// 设置错误
flowRef.current.setNodeError(nodeId, 'Error message');

// 清除错误
flowRef.current.clearNodeError(nodeId);
```

---

## 🎨 视图控制

```typescript
// 自适应视图
flowRef.current.fitView();

// 获取视口信息
const { x, y, zoom } = flowRef.current.getViewport();
```

---

## 💡 典型场景

### 节点执行流程
```typescript
async function executeNode(nodeId: string) {
  // 1. 设置加载状态
  flowRef.current.setNodeLoading(nodeId);
  
  try {
    // 2. 获取上游数据
    const upstreamNodes = flowRef.current.getUpstreamNodes(nodeId);
    const inputs = upstreamNodes.map(n => n.data);
    
    // 3. 执行节点逻辑
    const result = await processNode(inputs);
    
    // 4. 更新结果
    const node = flowRef.current.getNode(nodeId);
    if (node?.type === 'image') {
      flowRef.current.setNodeImage(nodeId, result.imageUrl);
    } else if (node?.type === 'video') {
      flowRef.current.setNodeVideo(nodeId, result.videoUrl);
    }
    
    // 5. 清除加载状态
    flowRef.current.clearNodeLoading(nodeId);
    
  } catch (error) {
    // 6. 处理错误
    flowRef.current.clearNodeLoading(nodeId);
    flowRef.current.setNodeError(nodeId, error.message);
  }
}
```

### 批量更新节点
```typescript
const nodeIds = ['node-1', 'node-2', 'node-3'];

// 设置加载状态
nodeIds.forEach(id => flowRef.current.setNodeLoading(id));

try {
  // 批量执行
  const results = await Promise.all(
    nodeIds.map(id => executeNode(id))
  );
  
  // 更新结果
  results.forEach((result, index) => {
    const nodeId = nodeIds[index];
    flowRef.current.setNodeOutput(nodeId, result);
    flowRef.current.clearNodeLoading(nodeId);
  });
  
} catch (error) {
  // 清除所有加载状态
  nodeIds.forEach(id => {
    flowRef.current.clearNodeLoading(id);
    flowRef.current.setNodeError(id, error.message);
  });
}
```

### 条件渲染 Inspector
```typescript
const renderNodeInspector = useCallback(({ nodeId, node }) => {
  // 获取节点配置
  const config = configStore.get(nodeId);
  
  // 获取上游节点（用于引用）
  const upstreamNodes = flowRef.current.getUpstreamNodes(nodeId);
  
  return (
    <InspectorPanel
      nodeId={nodeId}
      config={config}
      upstreamNodes={upstreamNodes}
      onChange={(updates) => {
        configStore.update(nodeId, updates);
      }}
      onRun={async () => {
        await executeNode(nodeId);
      }}
    />
  );
}, []);

// 传递给 CanvasFlow
<CanvasFlow
  ref={flowRef}
  renderNodeInspector={renderNodeInspector}
  // ...
/>
```

---

## ⚠️ 注意事项

### ✅ DO
- 使用专用方法（`setNodeImage`、`setNodeVideo` 等）
- 在执行前后管理 loading/error 状态
- 使用 `getNode` 验证节点存在
- 使用 `getUpstreamNodes` 获取依赖数据

### ❌ DON'T
- 不要使用 `updateNodeMedia`（已废弃）
- 不要手动操作 `node.data`（使用 API）
- 不要绕过白名单（非法字段会被过滤）
- 不要在未验证类型的情况下调用专用方法

---

## 🔗 完整文档

详细说明请参考 [API.md](./API.md)





















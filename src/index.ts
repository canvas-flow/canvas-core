
export { CanvasFlow } from './core/CanvasFlow';
export type { CanvasFlowProps, CanvasFlowHandle, CanvasMode, CanvasFlowUIOptions } from './core/CanvasFlow';

export * from './types/flow';
export * from './types/execution';
export * from './types/nodes';
export * from './types/nodeData';
export * from './types/schema'; // New schema types
export * from './types/inspector'; 

export * from './components/FloatingNodeMenu';
export * from './components/CanvasEmptyState';
export * from './components/NodeInspectorPanel';
export * from './components/nodes';

// Export default config and components for easier usage
export { defaultCanvasConfig, defaultComponentRegistry } from './core/defaults';

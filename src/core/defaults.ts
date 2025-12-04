
import { StandardNodeType } from '../types/nodes';
import { TextNode, ImageNode, VideoNode, AudioNode, UploadNode } from '../components/nodes';
import type { NodeData } from '../types/nodeData';
import { CanvasConfig, ComponentRegistry } from '../types/schema';

/** 默认的节点参数配置 */
export const DEFAULT_NODE_PARAMS = {
  model: '',
  provider: '',
  aspectRatio: '16:9',
  imageSize: '1024x1024',
  enableGoogleSearch: false,
  resolution: 'HD',
};

/** 为不同节点类型创建默认 data */
export const createDefaultNodeData = (nodeType: string): NodeData => {
  const baseData: NodeData = {
    title: '',
    prompt: '',
    params: { ...DEFAULT_NODE_PARAMS },
  };

  switch (nodeType) {
    case StandardNodeType.TEXT:
      return {
        ...baseData,
        text: '',
        title: '文本节点',
        params: {
          ...DEFAULT_NODE_PARAMS,
          enableGoogleSearch: true, // 文本节点默认开启搜索
        },
      };
    case StandardNodeType.IMAGE:
      return {
        ...baseData,
        title: '图片节点',
        resourceType: 'image/png',
      };
    case StandardNodeType.VIDEO:
      return {
        ...baseData,
        title: '视频节点',
        resourceType: 'video/mp4',
        params: {
          ...DEFAULT_NODE_PARAMS,
          aspectRatio: '16:9',
          resolution: '1080p',
        },
      };
    case StandardNodeType.AUDIO:
      return {
        ...baseData,
        title: '音频节点',
        resourceType: 'audio/mp3',
      };
    case StandardNodeType.UPLOAD:
      return {
        ...baseData,
        title: '上传节点',
        resourceType: '', // 上传后确定
      };
    default:
      return baseData;
  }
};

/** 默认组件注册表 */
export const defaultComponentRegistry: ComponentRegistry = {
  'TextNode': TextNode,
  'ImageNode': ImageNode,
  'VideoNode': VideoNode,
  'AudioNode': AudioNode,
  'UploadNode': UploadNode as any, // Fix type mismatch with explicit any or wrapper
};

/**
 * Canvas 包默认提供一份“最小可用”配置，方便开箱体验。
 * 更复杂的业务可以参考 demo 中的 defaultDemoConfig 进行扩展。
 */
export const defaultCanvasConfig: CanvasConfig = {
  style: {
    background: '#0f1115',
  },
  nodeDefinitions: [
    {
      type: StandardNodeType.TEXT,
      label: '文本',
      component: 'TextNode',
      width: 280,
      height: 220,
      defaultData: createDefaultNodeData(StandardNodeType.TEXT),
      connectionRules: {
        allowedTargets: [StandardNodeType.IMAGE, StandardNodeType.VIDEO],
      },
      inspector: {
        showInput: true,
        functional: [
          {
            field: 'params.model',
            type: 'select',
            label: '模型',
            icon: 'Cpu',
            options: [
              { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
              { label: 'Claude Haiku', value: 'claude-haiku' },
            ],
          },
        ],
        settings: [
          { field: 'params.temperature', type: 'number', label: '随机性', defaultValue: 0.7 },
        ],
      },
    },
    {
      type: StandardNodeType.IMAGE,
      label: '图片',
      component: 'ImageNode',
      width: 260,
      height: 260,
      defaultData: createDefaultNodeData(StandardNodeType.IMAGE),
      connectionRules: {
        allowedSources: [StandardNodeType.TEXT, StandardNodeType.UPLOAD],
        allowedTargets: [StandardNodeType.VIDEO],
      },
      inspector: {
        showInput: true,
        functional: [
          {
            field: 'params.model',
            type: 'select',
            label: '模型',
            icon: 'Image',
            options: [
              { label: 'DALL·E Mini', value: 'dalle-mini' },
              { label: 'Flux Quick', value: 'flux-quick' },
            ],
          },
          {
            field: 'params.aspectRatio',
            type: 'select',
            label: '比例',
            icon: 'Layout',
            options: [
              { label: '1:1', value: '1:1' },
              { label: '16:9', value: '16:9' },
            ],
          },
        ],
        settings: [],
      },
    },
    {
      type: StandardNodeType.VIDEO,
      label: '视频',
      component: 'VideoNode',
      width: 300,
      height: 200,
      defaultData: createDefaultNodeData(StandardNodeType.VIDEO),
      connectionRules: {
        allowedSources: [StandardNodeType.TEXT, StandardNodeType.IMAGE],
      },
      inspector: {
        showInput: true,
        functional: [
          {
            field: 'params.model',
            type: 'select',
            label: '模型',
            icon: 'Video',
            options: [
              { label: 'Sora Preview', value: 'sora-preview' },
            ],
          },
        ],
        settings: [],
      },
    },
    {
      type: StandardNodeType.UPLOAD,
      label: '上传',
      component: 'UploadNode',
      width: 240,
      height: 200,
      defaultData: createDefaultNodeData(StandardNodeType.UPLOAD),
      inspector: {
        showInput: false,
        functional: [],
        settings: [],
      },
    },
  ],
};

// 保持向后兼容（可选，如果项目其他地方严重依赖它，可以暂时保留，但建议逐步移除）
export const DEFAULT_NODE_TYPES: any = {}; 

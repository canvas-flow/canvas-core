
import { StandardNodeType } from '../types/nodes';
import { TextNode, ImageNode, VideoNode, AudioNode, UploadNode } from '../components/nodes';
import type { NodeData } from '../types/nodeData';
import { CanvasConfig, ComponentRegistry } from '../types/schema';

/** 为不同节点类型创建默认 data （仅媒体字段）*/
export const createDefaultNodeData = (nodeType: string): NodeData => {
  switch (nodeType) {
    case StandardNodeType.TEXT:
      return {
        text: '',
        resourceType: 'text/plain',
      };
    case StandardNodeType.IMAGE:
      return {
        src: '',
        resourceType: 'image/png',
      };
    case StandardNodeType.VIDEO:
      return {
        src: '',
        resourceType: 'video/mp4',
      };
    case StandardNodeType.AUDIO:
      return {
        src: '',
        resourceType: 'audio/mp3',
      };
    case StandardNodeType.UPLOAD:
      return {
        src: '',
        resourceType: '',
      };
    default:
      return {};
  }
};

/** 默认组件注册表 */
export const defaultComponentRegistry: ComponentRegistry = {
  'TextNode': TextNode,
  'ImageNode': ImageNode,
  'VideoNode': VideoNode,
  'AudioNode': AudioNode,
  'UploadNode': UploadNode as any,
};

/**
 * Canvas 包默认提供一份"最小可用"配置，方便开箱体验。
 * 更复杂的业务可以参考 demo 中的配置进行扩展。
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
    },
    {
      type: StandardNodeType.UPLOAD,
      label: '上传',
      component: 'UploadNode',
      width: 240,
      height: 200,
      defaultData: createDefaultNodeData(StandardNodeType.UPLOAD),
    },
  ],
};
 

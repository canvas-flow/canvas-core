import React from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { Group } from 'lucide-react';
import { getBounds } from '../core/utils';

interface SelectionMenuProps {
  selectedNodes: Node[];
  onCreateGroup: () => void;
}

export const SelectionMenu: React.FC<SelectionMenuProps> = ({ selectedNodes, onCreateGroup }) => {
  const { flowToScreenPosition } = useReactFlow();

  // 过滤掉已经是 group 的节点
  const validNodes = selectedNodes.filter(n => n.type !== 'group');

  if (validNodes.length < 2) return null;

  const bounds = getBounds(validNodes.map(n => ({
    position: n.position,
    width: n.measured?.width || n.width || 0,
    height: n.measured?.height || n.height || 0
  })));

  // 计算中心上方位置 (Flow 坐标)
  const centerFlow = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y
  };

  // 转换为屏幕坐标
  const screenPos = flowToScreenPosition(centerFlow);

  return (
    <div
      style={{
        position: 'absolute',
        left: screenPos.x,
        top: screenPos.y - 40, 
        transform: 'translate(-50%, -100%)', // 向上偏移
        zIndex: 2000,
        pointerEvents: 'all',
      }}
    >
      <button
        onClick={(e) => {
            e.stopPropagation();
            onCreateGroup();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          border: '1px solid #333',
          borderRadius: 20,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          fontSize: 13,
          fontWeight: 500,
          outline: 'none'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a1a1a'}
      >
        <Group size={14} />
        编组
      </button>
    </div>
  );
};



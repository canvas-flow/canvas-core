import React, { useState, useRef, useEffect } from 'react';
import { Plus, PenLine, Image as ImageIcon, Video, Music, Upload } from 'lucide-react';
import { StandardNodeType } from '../types/nodes';

export interface FloatingNodeMenuProps {
  /** 点击菜单项时的回调 */
  onAddNode: (type: string) => void;
  /** 可选：自定义显示的节点类型列表，默认为标准 5 种 */
  availableTypes?: Array<{ type: string; label: string; icon?: React.ReactNode }>;
  /** 如果提供位置，则作为弹出菜单显示在指定位置，不显示悬浮按钮 */
  position?: { x: number; y: number };
  /** 弹出菜单模式下的关闭回调 */
  onClose?: () => void;
}

const DEFAULT_NODE_TYPES = [
  { type: StandardNodeType.TEXT, label: '文本', icon: <PenLine size={16} /> },
  { type: StandardNodeType.IMAGE, label: '图片', icon: <ImageIcon size={16} /> },
  { type: StandardNodeType.VIDEO, label: '视频', icon: <Video size={16} /> },
  { type: StandardNodeType.AUDIO, label: '音频', icon: <Music size={16} /> },
  { type: StandardNodeType.UPLOAD, label: '上传', icon: <Upload size={16} /> },
];

export const FloatingNodeMenu: React.FC<FloatingNodeMenuProps> = ({
  onAddNode,
  availableTypes = DEFAULT_NODE_TYPES,
  position,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 如果提供了 position，说明是弹出菜单模式，默认视为打开（或由父组件控制渲染）
  // 这里我们假设如果 position 存在，就直接渲染菜单
  const isContextMenuMode = !!position;
  const showMenu = isContextMenuMode || isOpen;

  useEffect(() => {
    if (isContextMenuMode && onClose) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isContextMenuMode, onClose]);

  if (isContextMenuMode) {
    return (
      <div 
        ref={menuRef}
        style={{
          position: 'fixed', // 使用 fixed 以便相对于视口定位
          left: position.x,
          top: position.y,
          background: '#222',
          border: '1px solid #444',
          borderRadius: 8,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          zIndex: 1000, // 更高的层级
          minWidth: 140
        }}
      >
        {availableTypes.map(item => (
          <div
            key={item.type}
            onClick={() => {
              onAddNode(item.type);
              if (!isContextMenuMode) setIsOpen(false);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              color: '#eee',
              fontSize: 14,
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Floating Add Button */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: isOpen ? '#666' : '#333',
          border: '1px solid #444',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 100,
          transition: 'all 0.2s'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => e.currentTarget.style.background = isOpen ? '#666' : '#444'}
        onMouseLeave={(e) => e.currentTarget.style.background = isOpen ? '#666' : '#333'}
        title="Add Node"
      >
        <Plus 
          size={24} 
          style={{ 
            transform: isOpen ? 'rotate(45deg)' : 'none', 
            transition: 'transform 0.2s' 
          }} 
        />
      </div>

      {/* Menu List */}
      {showMenu && (
        <div style={{
          position: 'absolute',
          left: 84, // 24 + 48 + 12
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#222',
          border: '1px solid #444',
          borderRadius: 8,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
          zIndex: 100,
          minWidth: 140
        }}>
          {availableTypes.map(item => (
            <div
              key={item.type}
              onClick={() => {
                onAddNode(item.type);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                cursor: 'pointer',
                color: '#eee',
                fontSize: 14,
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};


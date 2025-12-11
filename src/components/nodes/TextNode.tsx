
import React, { useState } from 'react';
import { PenLine, Video, Image as ImageIcon, Music } from 'lucide-react';
import { NodeContentProps } from '../../types/schema';
import { NodeEmptyState, MenuAction } from './NodeEmptyState';
import '../../styles/canvas.css';

export const TextNode: React.FC<NodeContentProps> = ({ data, isConnected, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ 显示编辑器的条件：有连接关系 OR 已交互过 OR 已有文本内容
  const showEditor = isConnected || data.isInteracted || !!data.text;

  const menuItems: MenuAction[] = [
    { id: 'edit', icon: PenLine, label: '自己编写内容' },
    { id: 'text-to-video', icon: Video, label: '文生视频' },
    { id: 'image-to-prompt', icon: ImageIcon, label: '图片反推提示词' },
    { id: 'text-to-audio', icon: Music, label: '文生音乐' },
  ];

  if (!showEditor) {
    return (
      <NodeEmptyState 
        items={menuItems}
        onAction={(action) => {
          if (action === 'edit') {
            onChange({ isInteracted: true });
            setIsEditing(true);
          } else {
            console.log('Action triggered:', action);
          }
        }} 
      />
    );
  }
  
  return (
    <div 
      className="cf-text-node-container"
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          className="nodrag cf-text-node-input"
          autoFocus
          onBlur={() => setIsEditing(false)}
          placeholder="输入文本或者编辑生成结果..."
          value={data.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          onKeyDown={(e) => e.stopPropagation()} 
        />
      ) : (
        <>
          <div className={`cf-text-node-display ${!data.text ? 'placeholder' : ''}`}>
            {data.text || '双击输入文本...'}
          </div>
          <div className="cf-text-node-overlay">
            双击编辑
          </div>
        </>
      )}
    </div>
  );
};

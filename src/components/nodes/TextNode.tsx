
import React, { useState } from 'react';
import { NodeContentProps } from '../../types/schema';
import '../../styles/canvas.css';

export const TextNode: React.FC<NodeContentProps> = ({ data, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isNegativePrompt = !!data.isNegativePrompt;

  return (
    <div 
      className={`cf-text-node-container${isNegativePrompt ? ' cf-text-node-negative' : ''}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isNegativePrompt && (
        <div
          className="cf-text-node-negative-badge"
          title="反向提示词：描述不希望出现的内容。若模型不支持反向提示词，此内容将被忽略。"
        >
          反向提示词
        </div>
      )}
      {isEditing ? (
        <textarea
          className="nodrag cf-text-node-input"
          autoFocus
          onBlur={() => setIsEditing(false)}
          placeholder={isNegativePrompt ? '描述不希望出现的内容,若模型不支持反向提示词，此内容将被忽略...' : '输入文本或者编辑生成结果...'}
          value={data.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          onKeyDown={(e) => e.stopPropagation()} 
        />
      ) : (
        <>
          <div className={`cf-text-node-display ${!data.text ? 'placeholder' : ''}`}>
            {data.text || (isNegativePrompt ? '双击输入反向提示词,若模型不支持反向提示词，此内容将被忽略...' : '双击输入文本...')}
          </div>
          <div className="cf-text-node-overlay">
            双击编辑
          </div>
        </>
      )}
    </div>
  );
};

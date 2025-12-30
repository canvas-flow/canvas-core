import React, { memo, useState, useCallback, useMemo } from 'react';
import { NodeProps, NodeResizer, useReactFlow, useViewport } from '@xyflow/react';
import { Play, Ungroup, Save } from 'lucide-react';
import { useCanvasContext } from '../../core/CanvasContext';
import { ActionToolbar, ToolbarAction } from './ActionToolbar';

export const GroupNode = memo(({ id, data, selected }: NodeProps) => {
  const { setNodes } = useReactFlow();
  const { onGroupAction } = useCanvasContext();
  const { zoom } = useViewport();
  
  const [isEditing, setIsEditing] = useState(false);
  const [labelInput, setLabelInput] = useState(data.label as string || 'Group');

  const style = data.style as any;
  
  // 反向缩放，使标题文字大小固定不随画布缩放
  const inverseScale = 1 / zoom;
  
  const handleRename = useCallback(() => {
    setIsEditing(false);
    
    // 1. Local Update (Optimistic)
    setNodes((nodes) => nodes.map(n => {
      if (n.id === id) {
        return { ...n, data: { ...n.data, label: labelInput } };
      }
      return n;
    }));

    // 2. Notify Parent
    if (onGroupAction) {
        onGroupAction('update', { id, label: labelInput });
    }
  }, [id, labelInput, setNodes, onGroupAction]);

  const handleUngroup = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGroupAction) {
        onGroupAction('ungroup', { id });
    }
  }, [id, onGroupAction]);

  const handleRun = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGroupAction) {
        onGroupAction('run', { id });
    }
  }, [id, onGroupAction]);

  const defaultActions: ToolbarAction[] = useMemo(() => [
    {
        id: 'run',
        label: '整组执行',
        icon: Play,
        onClick: handleRun,
        className: 'text-green'
    },
    {
        id: 'save',
        label: '保存',
        icon: Save,
        onClick: (e) => {
            e.stopPropagation();
            if (onGroupAction) {
                onGroupAction('save', { id });
            }
        }
    },
    {
        id: 'ungroup',
        label: '解组',
        icon: Ungroup,
        onClick: handleUngroup
    }
  ], [handleRun, handleUngroup]);

  const actions = (data.toolbarActions as ToolbarAction[]) || defaultActions;

  const handleResizeEnd = useCallback((_event: any, params: any) => {
    if (onGroupAction) {
        onGroupAction('update', { 
            id, 
            width: params.width, 
            height: params.height,
            style: { ...style, width: params.width, height: params.height }
        });
    }
  }, [id, style, onGroupAction]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: style?.backgroundColor || 'rgba(30, 30, 30, 0.6)', 
      border: selected ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      position: 'relative',
      transition: 'all 0.2s ease',
      boxShadow: selected ? '0 0 0 2px rgba(255, 255, 255, 0.2)' : 'none',
    }}>
      <NodeResizer 
        minWidth={100} 
        minHeight={100} 
        isVisible={!!selected} 
        lineStyle={{ border: 'none' }}
        handleStyle={{ width: 10, height: 10, borderRadius: 2 }}
        color="#ffffff"
        onResizeEnd={handleResizeEnd}
      />
      
      {/* Header / Title Bar - 使用反向缩放使标题固定大小 */}
      <div 
        style={{
          position: 'absolute',
          top: -34 * inverseScale,
          left: 0,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 8,
          pointerEvents: 'none', // Let clicks pass through to underlying area unless hitting buttons
          transform: `scale(${inverseScale})`,
          transformOrigin: 'left top',
        }}
      >
        {/* Label */}
        <div 
            style={{
                padding: '4px 8px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 4,
                color: '#ccc',
                fontSize: 12,
                cursor: 'text',
                fontWeight: 500,
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                maxWidth: '60%',
            }}
            onDoubleClick={() => setIsEditing(true)}
        >
            {isEditing ? (
                <input
                autoFocus
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ background: 'transparent', border: 'none', color: 'inherit', outline: 'none', width: '100%', minWidth: 50 }}
                />
            ) : (
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.label as string}</span>
            )}
        </div>

        {/* Action Buttons */}
        <ActionToolbar 
            actions={actions}
            visible={true}
            style={{ 
                marginLeft: 'auto',
                opacity: selected ? 1 : 0,
                transition: 'opacity 0.2s',
                pointerEvents: selected ? 'auto' : 'none'
            }}
        />
      </div>
    </div>
  );
});

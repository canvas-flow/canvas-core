import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, CheckSquare } from 'lucide-react';
import type { InspectorItem, InspectorOption } from '../../types/inspector';
import { getNestedValue } from './helpers';
import { DynamicIcon } from './icons';

interface DropdownPortalProps {
  item: InspectorItem | null;
  nodeData: any;
  position: { top: number; left: number; width: number } | null;
  isLoading: boolean;
  options: InspectorOption[];
  onSelect: (field: string, value: any) => void;
  onClose: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  item,
  nodeData,
  position,
  isLoading,
  options,
  onSelect,
  onClose,
  dropdownRef
}) => {
  if (!item || !position) return null;

  const value = getNestedValue(nodeData, item.field, item.defaultValue);

  return createPortal(
    <div 
      ref={dropdownRef}
      className="inspector-dropdown-menu"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: position.width,
        background: '#222',
        border: '1px solid #444',
        borderRadius: 6,
        zIndex: 9999,
        maxHeight: 240,
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      {isLoading ? (
        <div style={{ padding: 12, display: 'flex', justifyContent: 'center' }}>
          <Loader2 size={16} className="animate-spin" />
        </div>
      ) : options.length === 0 ? (
        <div style={{ padding: 12, fontSize: 12, color: '#888', textAlign: 'center' }}>
          暂无可用选项，请检查上游节点。
        </div>
      ) : (
        options.map((opt) => (
          <div
            key={opt.value.toString()}
            className="dropdown-item"
            onClick={() => {
              onSelect(item.field, opt.value);
              onClose();
            }}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: 13,
              color: value === opt.value ? '#fff' : '#ccc',
              background: value === opt.value ? '#333' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
            onMouseLeave={(e) => e.currentTarget.style.background = value === opt.value ? '#333' : 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               {opt.icon && <DynamicIcon name={opt.icon} size={14} />}
               <span>{opt.label}</span>
            </div>
            {value === opt.value && <CheckSquare size={12} />}
          </div>
        ))
      )}
    </div>,
    document.body
  );
};

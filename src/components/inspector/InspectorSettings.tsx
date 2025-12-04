import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InspectorItem, InspectorOption } from '../../types/inspector';
import { getNestedValue } from './helpers';

interface InspectorSettingsProps {
  items: InspectorItem[];
  nodeData: any;
  onDataChange: (field: string, value: any) => void;
  optionsMap?: Record<string, InspectorOption[]>;
}

export const InspectorSettings: React.FC<InspectorSettingsProps> = ({
  items,
  nodeData,
  onDataChange,
  optionsMap = {}
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const instanceId = React.useId();

  // Handle click outside
  useEffect(() => {
    if (isAdvancedOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
          setIsAdvancedOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isAdvancedOpen]);

  // Handle global mutex
  useEffect(() => {
    if (isAdvancedOpen) {
      const handleOverlayActive = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.id !== instanceId) {
          setIsAdvancedOpen(false);
        }
      };
      window.addEventListener('canvas-overlay-active', handleOverlayActive);
      return () => window.removeEventListener('canvas-overlay-active', handleOverlayActive);
    }
  }, [isAdvancedOpen, instanceId]);

  const toggleAdvanced = () => {
    if (!isAdvancedOpen) {
      window.dispatchEvent(new CustomEvent('canvas-overlay-active', { detail: { id: instanceId } }));
      setIsAdvancedOpen(true);
    } else {
      setIsAdvancedOpen(false);
    }
  };

  if (!items || items.length === 0) return null;

  const renderSettingItem = (item: InspectorItem) => {
    const value = getNestedValue(nodeData, item.field, item.defaultValue ?? '');

    const commonLabel = item.label && (
      <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>
        {item.label}
      </label>
    );

    const commonTooltip = item.tooltip && (
      <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
        {item.tooltip}
      </div>
    );

    const renderByType = () => {
      if (item.type === 'toggle') {
        return (
          <div className="form-item" key={item.field} style={{ marginBottom: 12 }}>
            {/* Force flex-start to avoid spreading */}
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start',
              cursor: 'pointer', 
              userSelect: 'none',
              gap: 8,
              width: '100%' 
            }}>
              <input 
                type="checkbox"
                checked={!!value}
                onChange={(e) => onDataChange(item.field, e.target.checked)}
                style={{ 
                  margin: 0, 
                  width: 14, 
                  height: 14,
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: 12, color: '#ccc' }}>
                {item.label || item.field}
              </span>
            </label>
            {commonTooltip}
          </div>
        );
      }

      // Other types keep the label-on-top layout
      const inputElement = (() => {
        if (item.type === 'textarea') {
          return (
            <textarea 
              rows={3}
              value={value}
              onChange={(e) => onDataChange(item.field, e.target.value)}
              placeholder={item.placeholder}
              style={{ 
                width: '100%', 
                background: '#111', 
                border: '1px solid #333', 
                borderRadius: 4, 
                padding: 6, 
                color: '#eee', 
                fontSize: 12,
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          );
        }

        if (item.type === 'number') {
          return (
            <input 
              type="number"
              value={value}
              onChange={(e) => onDataChange(item.field, parseFloat(e.target.value))}
              style={{ 
                width: '100%', 
                background: '#111', 
                border: '1px solid #333', 
                borderRadius: 4, 
                padding: 6, 
                color: '#eee', 
                fontSize: 12,
                boxSizing: 'border-box'
              }}
            />
          );
        }

        if (item.type === 'select') {
          const options = optionsMap[item.field] || [];
          return (
            <select
              value={value ?? ''}
              onChange={(e) => onDataChange(item.field, e.target.value)}
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #333',
                borderRadius: 4,
                padding: 6,
                color: options.length ? '#eee' : '#888',
                fontSize: 12,
                boxSizing: 'border-box'
              }}
              disabled={options.length === 0}
            >
              {options.length === 0 ? (
                <option value="">暂无可用选项</option>
              ) : (
                options.map(opt => (
                  <option key={opt.value.toString()} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))
              )}
            </select>
          );
        }

        // Fallback: text input
        return (
          <input 
            type="text"
            value={value}
            onChange={(e) => onDataChange(item.field, e.target.value)}
            style={{ 
              width: '100%', 
              background: '#111', 
              border: '1px solid #333', 
              borderRadius: 4, 
              padding: 6, 
              color: '#eee', 
              fontSize: 12,
              boxSizing: 'border-box'
            }}
          />
        );
      })();

      return (
        <div key={item.field} className="form-item" style={{ marginBottom: 12 }}>
          {commonLabel}
          {inputElement}
          {commonTooltip}
        </div>
      );
    };

    return renderByType();
  };

  return (
    <div className="inspector-footer" ref={settingsRef}>
      <div 
        className="inspector-footer-toggle"
        onClick={toggleAdvanced}
      >
        <ChevronDown 
          size={14} 
          style={{ 
            transform: isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
        <span>高级设置</span>
      </div>
      
      {isAdvancedOpen && (
        <div className="inspector-advanced-content">
          {items.map(item => renderSettingItem(item))}
        </div>
      )}
    </div>
  );
};

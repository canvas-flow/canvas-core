import React from 'react';
import { ChevronDown, CheckSquare, Square, ArrowUp } from 'lucide-react';
import type { InspectorItem, InspectorOption } from '../../types/inspector';
import { DynamicIcon } from './icons';
import { getNestedValue } from './helpers';

interface InspectorToolbarProps {
  items: InspectorItem[];
  nodeData: any;
  onDataChange: (field: string, value: any) => void;
  activeDropdown: string | null;
  dynamicOptions: Record<string, any[]>;
  onToggleDropdown: (item: InspectorItem, buttonRef: HTMLDivElement | null) => void;
  buttonRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onRunNode?: () => void;
  isRunning?: boolean;
  disabled?: boolean;
  optionsMap?: Record<string, InspectorOption[]>;
}

export const InspectorToolbar: React.FC<InspectorToolbarProps> = ({
  items,
  nodeData,
  onDataChange,
  activeDropdown,
  dynamicOptions,
  onToggleDropdown,
  buttonRefs,
  onRunNode,
  isRunning = false,
  disabled = false,
  optionsMap = {},
}) => {
  const renderFunctionalItem = (item: InspectorItem) => {
    const value = getNestedValue(nodeData, item.field, item.defaultValue);

    if (item.type === 'toggle') {
      return (
        <div 
          key={item.field}
          className="toolbar-btn" 
          onClick={() => onDataChange(item.field, !value)}
          title={item.label}
        >
          {value ? <CheckSquare size={16} color="#ccc" /> : <Square size={16} color="#555" />}
          {item.label && <span>{item.label}</span>}
        </div>
      );
    }

    if (item.type === 'select') {
      const fallbackOptions = item.options || dynamicOptions[item.field] || [];
      const options = optionsMap[item.field] ?? fallbackOptions;
      const currentOption = options.find(o => o.value === value);
      const hasOptions = options.length > 0;
      // 如果没有值或找不到对应选项，显示第一个选项
      const displayLabel = currentOption 
        ? currentOption.label 
        : (value 
          ? value 
          : (hasOptions ? options[0].label : '暂无可用选项'));

      // Use option icon if available, otherwise field icon
      const displayIcon = currentOption?.icon || item.icon;

      return (
        <div key={item.field} className="toolbar-dropdown-wrapper" style={{ position: 'relative' }}>
          <div 
            ref={(el) => { buttonRefs.current[item.field] = el; }}
            className={`toolbar-btn ${activeDropdown === item.field ? 'active' : ''}`}
            onClick={() => onToggleDropdown(item, buttonRefs.current[item.field])}
            title={item.label}
          >
            <DynamicIcon name={displayIcon} size={16} />
            <span className="model-name">{displayLabel}</span>
            <ChevronDown size={14} className="chevron-icon" />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="inspector-toolbar">
      {items.map(item => renderFunctionalItem(item))}
      
      {/* Run Button (Always Present) */}
      <button 
        className="run-btn" 
        title={isRunning ? "执行中..." : "运行节点"} 
        style={{ marginLeft: 'auto' }}
        onClick={onRunNode}
        disabled={isRunning || disabled}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};

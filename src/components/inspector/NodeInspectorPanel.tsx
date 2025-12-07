import React, { useState, useEffect, useRef } from 'react';
import type { NodeInspectorProps } from '../../types/nodes';
import type { InspectorItem, InspectorOption } from '../../types/inspector';
import { InspectorToolbar } from './InspectorToolbar';
import { InspectorSettings } from './InspectorSettings';
import { DropdownPortal } from './DropdownPortal';
import { buildNestedUpdate, getNestedValue } from './helpers';
import { useInspectorModel } from './useInspectorModel';

interface NodeInspectorPanelProps extends NodeInspectorProps {
  className?: string;
  style?: React.CSSProperties;
  showInput?: boolean;
  onRunNode?: () => void;
  isRunning?: boolean;
  disabled?: boolean;
}

export const NodeInspectorPanel: React.FC<NodeInspectorPanelProps> = ({ 
  node, 
  onChange,
  config,
  onRequestOptions,
  className = '',
  style,
  showInput = true,
  onRunNode,
  isRunning = false,
  disabled = false,
  upstreamNodes,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const instanceId = React.useId();

  // Use the new hook for model logic
  const {
    functionalItems,
    settingItems,
    resolvedOptions,
    dynamicOptions,
    setDynamicOptions,
    loadingOptions,
    setLoadingOptions,
    selectFields,
    safeUpstream
  } = useInspectorModel({
    config,
    nodeData: node?.data,
    upstreamNodes
  });

  // Auto-resize prompt textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [node?.data?.prompt]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        const clickedButton = Object.values(buttonRefs.current).some(btn => btn?.contains(target));
        if (!clickedButton) {
          setActiveDropdown(null);
          setDropdownPosition(null);
        }
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Handle global mutex for dropdown
  useEffect(() => {
    if (activeDropdown) {
      const handleOverlayActive = (e: Event) => {
        const customEvent = e as CustomEvent;
        // Check if the event was triggered by THIS dropdown (id matches instanceId + activeDropdown)
        if (customEvent.detail?.id !== (instanceId + activeDropdown)) {
          setActiveDropdown(null);
          setDropdownPosition(null);
        }
      };
      window.addEventListener('canvas-overlay-active', handleOverlayActive);
      return () => window.removeEventListener('canvas-overlay-active', handleOverlayActive);
    }
  }, [activeDropdown, instanceId]);

  // 4. Auto-correct invalid model value (e.g. when config changes or defaults are invalid)
  // This ensures that if the current params.model is not in the available options,
  // we automatically select the first valid option and sync its action.
  useEffect(() => {
    if (!config?.functional) return;

    const modelFieldConfig = config.functional.find(f => f.field === 'params.model');
    if (!modelFieldConfig || !modelFieldConfig.options || modelFieldConfig.options.length === 0) return;

    const currentModel = getNestedValue(node?.data, 'params.model');
    
    // Check if current model exists in options (loose comparison for number/string)
    const isModelValid = modelFieldConfig.options.some(opt => String(opt.value) === String(currentModel));

    if (!isModelValid) {
      // Fallback to first option
      const validOption = modelFieldConfig.options[0];
      // console.log('[Inspector] Auto-correcting invalid model:', currentModel, 'to', validOption.value);
      
      let update = buildNestedUpdate(node?.data, 'params.model', validOption.value);
      
      // Sync action if available
      if (validOption.action) {
        update = buildNestedUpdate(update, 'params.action', validOption.action);
      }
      
      onChange(update);
    }
  }, [config, node?.data, onChange]);

  // 渲染上游引用
  const renderUpstreamReferences = () => {
    if (!upstreamNodes || upstreamNodes.length === 0) return null;

    return (
      <div className="inspector-references">
        {upstreamNodes.map(node => {
          let content: React.ReactNode = null;
          let label = node.label || '节点';
          const mediaSrc = node.data?.src || node.data?.output;
          const isUpload = node.type === 'user-upload';
          const fileType = node.data?.fileType || '';

          if (mediaSrc && typeof mediaSrc === 'string') {
            if (node.type === 'video' || (isUpload && fileType.startsWith('video/'))) {
               content = (
                 <>
                    <video src={mediaSrc} className="inspector-ref-thumbnail" muted />
                    <span className="inspector-ref-text">视频内容</span>
                 </>
               );
            } else if (node.type === 'image' || (isUpload && fileType.startsWith('image/'))) {
                content = (
                  <>
                     <img src={mediaSrc} alt="ref" className="inspector-ref-thumbnail" />
                     <span className="inspector-ref-text">图片内容</span>
                  </>
                );
            } else if (isUpload) {
                // 非音视频的 Upload 节点，显示文件名
                content = <span className="inspector-ref-text">{node.data?.fileName || '文件'}</span>;
            } else {
                content = <span className="inspector-ref-text">媒体文件</span>;
            }
          } else if (isUpload && node.data?.fileName) {
              // Upload 节点没有 output/src 但有 fileName (可能是处理中或仅文件信息)
              content = <span className="inspector-ref-text">{node.data.fileName}</span>;
          } else if (node.data?.text) {
             content = <span className="inspector-ref-text">{node.data.text}</span>;
          } else {
             content = <span className="inspector-ref-text" style={{ opacity: 0.5 }}>无内容</span>;
          }

          return (
            <div key={node.id} className="inspector-ref-item">
              <div className="inspector-ref-content">
                 <span style={{ fontWeight: 500, color: '#888', marginRight: 4, fontSize: 11 }}>@{label}:</span>
                 {content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 初始化/同步：保持 select 字段的值与可见选项一致
  useEffect(() => {
    if (!node) return;
    const updates: Record<string, any> = {};

    selectFields.forEach(field => {
      const options = resolvedOptions[field.field] || [];
      const currentValue = getNestedValue(node.data, field.field);

      if (options.length === 0) {
        if (currentValue !== null && currentValue !== undefined) {
          Object.assign(updates, buildNestedUpdate(node.data, field.field, null));
        }
        return;
      }

      const hasOption = options.some(opt => opt.value === currentValue);
      if (!hasOption) {
        Object.assign(updates, buildNestedUpdate(node.data, field.field, options[0].value));
      }
    });

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [node?.id, node?.data, selectFields, resolvedOptions, onChange]);

  if (!node) return null;

  const handleDataChange = (field: string, value: any) => {
    let update = buildNestedUpdate(node.data, field, value);

    // 联动逻辑：当 params.model 改变时，同步更新 action
    if (field === 'params.model') {
      let selectedOption: InspectorOption | undefined;
      
      // 1. 尝试从 resolvedOptions 中查找 (包含动态选项和已过滤的选项)
      if (resolvedOptions[field]) {
        selectedOption = resolvedOptions[field].find(opt => String(opt.value) === String(value));
      }
      
      // 2. 如果没找到 (可能是被 upstream 过滤了，或者是静态配置但还没 resolve)，直接查原始 config
      if (!selectedOption && config?.functional) {
        const modelField = config.functional.find(f => f.field === 'params.model');
        if (modelField?.options) {
          selectedOption = modelField.options.find(opt => String(opt.value) === String(value));
        }
      }

      if (selectedOption) {
        // console.log('[Inspector] Model changed to', value, 'Found option:', selectedOption);
        if (selectedOption.action) {
          // console.log('[Inspector] Syncing action to', selectedOption.action);
          update = buildNestedUpdate(update, 'params.action', selectedOption.action);
        }
      } else {
        console.warn('[Inspector] Model changed to', value, 'but option config not found');
      }
    }

    onChange(update);
  };

  const handleToggleDropdown = async (item: InspectorItem, buttonRef: HTMLDivElement | null) => {
    if (activeDropdown === item.field) {
      setActiveDropdown(null);
      setDropdownPosition(null);
      return;
    }

    // 计算下拉菜单位置
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 180),
      });
    }

    // Notify others to close
    window.dispatchEvent(new CustomEvent('canvas-overlay-active', { detail: { id: instanceId + item.field } }));

    setActiveDropdown(item.field);

    // Load dynamic options if needed
    if (item.action && onRequestOptions && !dynamicOptions[item.field]) {
      setLoadingOptions(prev => ({ ...prev, [item.field]: true }));
      try {
        const options = await onRequestOptions(item.action, { 
          nodeId: node.id, 
          nodeType: node.type,
          currentData: node.data,
          upstreamNodes: safeUpstream
        });
        setDynamicOptions(prev => ({ ...prev, [item.field]: options }));
      } catch (err) {
        console.error('Failed to load options', err);
      } finally {
        setLoadingOptions(prev => ({ ...prev, [item.field]: false }));
      }
    }
  };

  // Fallback if no config provided
  if (!config) {
    return (
      <div className={`canvas-inspector ${className}`} style={style}>
        <div style={{ padding: 12, color: '#888', fontSize: 12 }}>
          Loading configuration...
        </div>
      </div>
    );
  }

  const activeItem = [...functionalItems, ...settingItems]
    .find(i => i.field === activeDropdown);

  return (
    <>
      <div className={`canvas-inspector ${className}`} style={style}>
        {/* 1. Input Content Area */}
        {showInput && (
          <div className="inspector-input-area">
            {/* Upstream References */}
            {renderUpstreamReferences()}
            
            <textarea 
              ref={textareaRef}
              className="inspector-textarea"
              placeholder="描述你想要生成的内容..."
              value={node.data.prompt || ''}
              onChange={(e) => handleDataChange('prompt', e.target.value)}
              rows={1}
            />
          </div>
        )}

        {/* 2. Functional Toolbar */}
        {/* Only show if there are items (Run button is handled inside, but if items is empty, toolbar might look empty except for run btn) */}
        {/* Actually, if items are empty, InspectorToolbar still renders Run button. 
            If we want to hide toolbar completely when empty, we need to decide if Run button should be hidden too. 
            Assuming Run button is always needed, we keep it. 
            However, the user asked "默认的1080P这个选项和下方高级设置的选项不要了吧，除非我配置了才有". 
            This implies hiding the *content* not necessarily the container if it has other critical controls.
            But InspectorSettings should definitely be hidden if empty.
        */}
        <InspectorToolbar
          items={functionalItems}
          nodeData={node.data}
          onDataChange={handleDataChange}
          activeDropdown={activeDropdown}
          dynamicOptions={dynamicOptions}
          onToggleDropdown={handleToggleDropdown}
          buttonRefs={buttonRefs}
          onRunNode={onRunNode}
          isRunning={isRunning}
          disabled={disabled}
          optionsMap={resolvedOptions}
        />

        {/* 3. Settings Area (Dynamic based on model) */}
        {/* Only render InspectorSettings if there are items */}
        {settingItems.length > 0 && (
          <InspectorSettings
            items={settingItems}
            nodeData={node.data}
            onDataChange={handleDataChange}
            optionsMap={resolvedOptions}
          />
        )}
      </div>

      {/* Portal Dropdown */}
      <DropdownPortal
        item={activeItem || null}
        nodeData={node.data}
        position={dropdownPosition}
        isLoading={loadingOptions[activeDropdown || ''] || false}
        options={activeItem ? (resolvedOptions[activeItem.field] || []) : []}
        onSelect={handleDataChange}
        onClose={() => {
          setActiveDropdown(null);
          setDropdownPosition(null);
        }}
        dropdownRef={dropdownRef}
      />
    </>
  );
};

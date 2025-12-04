import { useMemo, useState } from 'react';
import type { InspectorConfig, InspectorOption } from '../../types/inspector';
import type { CanvasUpstreamNode } from '../../types/flow';
import { getNestedValue } from './helpers';

const EMPTY_UPSTREAM: CanvasUpstreamNode[] = [];

const matchesAllowedUpstream = (
  option: InspectorOption,
  upstreamNodes: CanvasUpstreamNode[]
) => {
  if (!option.allowedUpstreamTypes || option.allowedUpstreamTypes.length === 0) {
    return true;
  }
  if (!upstreamNodes.length) {
    return true;
  }
  const allowed = new Set(option.allowedUpstreamTypes);
  return !upstreamNodes.some(node => !allowed.has(node.type));
};

const filterOptionsByUpstream = (
  options: InspectorOption[] | undefined,
  upstreamNodes: CanvasUpstreamNode[]
): InspectorOption[] => {
  if (!options || options.length === 0) {
    return [];
  }

  const filtered = options.filter(opt => matchesAllowedUpstream(opt, upstreamNodes));
  return filtered.length > 0 ? filtered : [];
};

interface UseInspectorModelProps {
  config?: InspectorConfig;
  nodeData: any;
  upstreamNodes?: CanvasUpstreamNode[];
}

export const useInspectorModel = ({
  config,
  nodeData,
  upstreamNodes,
}: UseInspectorModelProps) => {
  // 1. Determine active model and its config
  const currentModelValue = getNestedValue(nodeData, 'params.model');
  const modelField = config?.functional?.find(f => f.field === 'params.model');
  
  const activeModelOption = useMemo(() => {
    if (!modelField?.options || !currentModelValue) return null;
    return modelField.options.find(opt => String(opt.value) === String(currentModelValue)) || null;
  }, [modelField, currentModelValue]);

  // 2. Merge fields
  // Functional: Common Functional + Model's Functional
  const functionalItems = useMemo(() => {
    const common = config?.functional ?? [];
    const modelSpecific = activeModelOption?.functional ?? [];
    
    // Insert model specific items after the params.model field
    // Or just append them? "和Model下拉框并排显示" -> append usually works for flex layout
    // Let's append them for now, or insert right after params.model if possible.
    
    // Strategy: Return common first, but we might want to inject model specific ones 
    // right after the model selector if we want them "next to it".
    // For simplicity in this iteration: Append them.
    // Actually, to be safe and distinct:
    // We might want to filter out 'params.model' from common if we were rebuilding it, but we aren't.
    
    // Better UI: Insert immediately after params.model
    const modelIndex = common.findIndex(f => f.field === 'params.model');
    if (modelIndex !== -1 && modelSpecific.length > 0) {
        const before = common.slice(0, modelIndex + 1);
        const after = common.slice(modelIndex + 1);
        return [...before, ...modelSpecific, ...after];
    }

    return [...common, ...modelSpecific];
  }, [config?.functional, activeModelOption]);

  // Settings: Common Settings + Model's Settings (or replace? usually replace or merge)
  // Based on "通用配置" vs "特定模型配置", usually model settings extend common ones.
  // Or if we want full control, model settings might replace some common ones?
  // Let's assume Append/Merge for now.
  // "底部设置区（表单）- 作为通用兜底配置" -> implies Common is fallback or base.
  // Let's put Common first, then Model specific.
  const settingItems = useMemo(() => {
    const common = config?.settings ?? [];
    const modelSpecific = activeModelOption?.settings ?? [];
    return [...common, ...modelSpecific];
  }, [config?.settings, activeModelOption]);

  const safeUpstream = upstreamNodes?.length ? upstreamNodes : EMPTY_UPSTREAM;

  // 3. Dynamic options state
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, InspectorOption[]>>({});
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({});

  // 4. Resolve options for all fields
  const allFields = useMemo(
    () => [...functionalItems, ...settingItems],
    [functionalItems, settingItems]
  );

  const selectFields = useMemo(
    () => allFields.filter(field => field.type === 'select'),
    [allFields]
  );

  const resolvedOptions = useMemo(() => {
    const map: Record<string, InspectorOption[]> = {};
    selectFields.forEach(field => {
      const baseOptions = (field.options && field.options.length > 0)
        ? field.options
        : (dynamicOptions[field.field] || []);
      map[field.field] = filterOptionsByUpstream(baseOptions, safeUpstream);
    });
    return map;
  }, [selectFields, dynamicOptions, safeUpstream]);

  return {
    functionalItems,
    settingItems,
    resolvedOptions,
    dynamicOptions,
    setDynamicOptions,
    loadingOptions,
    setLoadingOptions,
    selectFields,
    safeUpstream
  };
};

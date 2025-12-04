/**
 * Inspector 辅助函数
 */

/**
 * 获取嵌套字段的值
 * 支持 'field' 和 'params.field' 格式
 */
export const getNestedValue = (data: any, field: string, defaultValue?: any): any => {
  if (!data) return defaultValue;
  const parts = field.split('.');
  let value: any = data;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return defaultValue;
    }
  }
  
  return value ?? defaultValue;
};

/**
 * 构建嵌套数据更新对象 (Deep Merge)
 * 支持 'field' 和 'params.field' 格式
 * 修复了之前递归丢失中间层数据的 Bug
 */
export const buildNestedUpdate = (data: any, field: string, value: any): any => {
  const parts = field.split('.');
  
  // 递归构建新对象，同时保留旧数据
  const setDeep = (obj: any, path: string[], val: any): any => {
    const [head, ...tail] = path;
    
    // 如果是最后一层，直接赋值
    if (path.length === 1) {
      return {
        ...obj,
        [head]: val
      };
    }

    // 如果还有下一层，需要保留当前层的数据，并递归更新
    // 注意：这里需要防御 obj[head] 不存在或不是对象的情况
    const nextObj = (obj && typeof obj === 'object' && obj[head]) ? obj[head] : {};
    
    return {
      ...obj,
      [head]: setDeep(nextObj, tail, val)
    };
  };

  // 基于原始 data 构建完整的新对象
  return setDeep(data || {}, parts, value);
};

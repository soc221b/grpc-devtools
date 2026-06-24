/**
 * Transform Protocol Buffers Well-Known Types to more readable formats
 */

interface StructValue {
  kind?: string;
  structValue?: { fieldsMap?: Array<[string, StructValue]> };
  listValue?: { valuesList?: StructValue[] };
  numberValue?: number;
  stringValue?: string;
  boolValue?: boolean;
  nullValue?: 0;
}

interface WrapperValue {
  stringValue?: string;
  numberValue?: number;
  boolValue?: boolean;
  nullValue?: 0;
  structValue?: any;
  listValue?: { valuesList?: any[] };
}

interface TransformableObject {
  [key: string]: any;
}

/**
 * Transform a Struct's fieldsMap array to a regular object
 */
function transformStructFieldsMap(fieldsMap: Array<[string, any]>, options?: { removeListSuffix?: boolean }): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of fieldsMap) {
    // First try to transform as a StructValue, then as a general value
    if (value && typeof value === 'object' && value.kind) {
      result[key] = transformStructValue(value, options);
    } else {
      // This might be a wrapper value or other Well-Known Type
      result[key] = transformWellKnownTypes(value, options);
    }
  }
  
  return result;
}

/**
 * Transform a Struct Value to its actual JavaScript value
 */
function transformStructValue(value: StructValue, options?: { removeListSuffix?: boolean }): any {
  if (!value || typeof value !== 'object') {
    return value;
  }
  
  // Check if this is actually a Struct Value (has a 'kind' field)
  if (!value.kind) {
    // Not a struct value, return as-is
    return value;
  }

  switch (value.kind) {
    case 'structValue':
      if (value.structValue?.fieldsMap) {
        return transformStructFieldsMap(value.structValue.fieldsMap, options);
      }
      return {};
    
    case 'listValue':
      if (value.listValue?.valuesList) {
        return value.listValue.valuesList.map((v: any) => transformStructValue(v, options));
      }
      return [];
    
    case 'numberValue':
      return value.numberValue ?? 0;
    
    case 'stringValue':
      return value.stringValue ?? '';
    
    case 'boolValue':
      return value.boolValue ?? false;
    
    case 'nullValue':
      return null;
    
    default:
      return null;
  }
}

/**
 * Recursively transform Well-Known Types in an object
 */
export function transformWellKnownTypes(obj: any, options?: { removeListSuffix?: boolean }): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => transformWellKnownTypes(item, options));
  }

  // Handle non-objects
  if (typeof obj !== 'object') {
    return obj;
  }

  // Check if this is a Struct with fieldsMap
  if (obj.fieldsMap && Array.isArray(obj.fieldsMap)) {
    // Ensure this looks like a proper Struct (fieldsMap contains [key, value] pairs)
    if (obj.fieldsMap.length > 0 && Array.isArray(obj.fieldsMap[0]) && obj.fieldsMap[0].length === 2) {
      return transformStructFieldsMap(obj.fieldsMap, options);
    }
  }

  // Check if this is a Value object (has specific kind values)
  const validKinds = ['structValue', 'listValue', 'numberValue', 'stringValue', 'boolValue', 'nullValue'];
  if (obj.kind && typeof obj.kind === 'string' && validKinds.includes(obj.kind)) {
    return transformStructValue(obj, options);
  }
  
  // Check if this is a wrapper Value
  const wrapperKeys = ['stringValue', 'numberValue', 'boolValue', 'structValue', 'listValue', 'nullValue'];
  const objKeys = Object.keys(obj);
  
  // Check if ALL keys are wrapper keys (could be multiple due to oneOf implementation)
  const hasOnlyWrapperKeys = objKeys.length > 0 && objKeys.every(key => wrapperKeys.includes(key));
  
  if (hasOnlyWrapperKeys) {
    // Handle the most common case: single wrapper key
    if (objKeys.length === 1) {
      const key = objKeys[0];
      switch (key) {
        case 'stringValue':
          return obj.stringValue;
        case 'numberValue':
          return obj.numberValue;
        case 'boolValue':
          return obj.boolValue;
        case 'nullValue':
          return null;
        case 'structValue':
          return transformWellKnownTypes(obj.structValue, options);
        case 'listValue':
          // Handle nested listValue structure
          if (obj.listValue && obj.listValue.valuesList) {
            return obj.listValue.valuesList.map((v: any) => transformWellKnownTypes(v, options));
          }
          return transformWellKnownTypes(obj.listValue, options);
      }
    } else {
      // Multiple wrapper keys - take the first defined one
      for (const key of wrapperKeys) {
        if (key in obj && obj[key] !== undefined) {
          switch (key) {
            case 'stringValue':
              return obj.stringValue;
            case 'numberValue':
              return obj.numberValue;
            case 'boolValue':
              return obj.boolValue;
            case 'nullValue':
              return null;
            case 'structValue':
              return transformWellKnownTypes(obj.structValue, options);
            case 'listValue':
              if (obj.listValue && obj.listValue.valuesList) {
                return obj.listValue.valuesList.map((v: any) => transformWellKnownTypes(v, options));
              }
              return transformWellKnownTypes(obj.listValue, options);
          }
        }
      }
    }
  }

  // Check if this is a ListValue
  if (obj.valuesList && Array.isArray(obj.valuesList)) {
    return obj.valuesList.map((v: any) => transformStructValue(v, options));
  }

  // Check if this is an Any type
  if (obj.typeUrl && obj.value) {
    // For now, just return the object as-is, but mark it with the type URL
    return {
      '@type': obj.typeUrl,
      ...transformWellKnownTypes(obj.value, options)
    };
  }

  // Check if this is a Duration
  if (obj.seconds !== undefined && obj.nanos !== undefined && Object.keys(obj).length === 2) {
    const seconds = Number(obj.seconds) || 0;
    const nanos = Number(obj.nanos) || 0;
    const totalMs = seconds * 1000 + nanos / 1000000;
    return `${totalMs}ms`;
  }

  // Check if this is a FieldMask
  if (obj.paths && Array.isArray(obj.paths)) {
    return obj.paths.join(',');
  }

  // Recursively transform nested objects
  const result: TransformableObject = {};
  for (const [key, value] of Object.entries(obj)) {
    // Remove 'List' suffix from field names if option is enabled
    const transformedKey = options?.removeListSuffix && key.endsWith('List') && Array.isArray(value) 
      ? key.slice(0, -4) 
      : key;
    
    result[transformedKey] = transformWellKnownTypes(value, options);
  }

  return result;
}
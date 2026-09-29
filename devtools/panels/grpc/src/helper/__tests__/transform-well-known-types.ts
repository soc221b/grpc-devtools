import { transformWellKnownTypes } from '../transform-well-known-types';

describe('transformWellKnownTypes', () => {
  it('should transform Struct with fieldsMap to regular object', () => {
    const input = {
      fieldsMap: [
        ['key1', { kind: 'stringValue', stringValue: 'value1' }],
        ['key2', { kind: 'numberValue', numberValue: 42 }],
        ['key3', { kind: 'boolValue', boolValue: true }],
        ['key4', { kind: 'nullValue', nullValue: 0 }],
      ]
    };

    const expected = {
      key1: 'value1',
      key2: 42,
      key3: true,
      key4: null,
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should transform nested Struct values', () => {
    const input = {
      fieldsMap: [
        ['nested', {
          kind: 'structValue',
          structValue: {
            fieldsMap: [
              ['innerKey', { kind: 'stringValue', stringValue: 'innerValue' }]
            ]
          }
        }],
        ['list', {
          kind: 'listValue',
          listValue: {
            valuesList: [
              { kind: 'numberValue', numberValue: 1 },
              { kind: 'numberValue', numberValue: 2 },
              { kind: 'numberValue', numberValue: 3 }
            ]
          }
        }]
      ]
    };

    const expected = {
      nested: {
        innerKey: 'innerValue'
      },
      list: [1, 2, 3]
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should transform Value objects', () => {
    const stringValue = { kind: 'stringValue', stringValue: 'hello' };
    const numberValue = { kind: 'numberValue', numberValue: 123 };
    const boolValue = { kind: 'boolValue', boolValue: false };
    const nullValue = { kind: 'nullValue', nullValue: 0 };

    expect(transformWellKnownTypes(stringValue)).toBe('hello');
    expect(transformWellKnownTypes(numberValue)).toBe(123);
    expect(transformWellKnownTypes(boolValue)).toBe(false);
    expect(transformWellKnownTypes(nullValue)).toBe(null);
  });

  it('should transform ListValue', () => {
    const input = {
      valuesList: [
        { kind: 'stringValue', stringValue: 'a' },
        { kind: 'numberValue', numberValue: 1 },
        { kind: 'boolValue', boolValue: true }
      ]
    };

    const expected = ['a', 1, true];

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should transform Duration to milliseconds string', () => {
    const input = {
      seconds: '3',
      nanos: 500000000
    };

    expect(transformWellKnownTypes(input)).toBe('3500ms');
  });

  it('should transform FieldMask to comma-separated string', () => {
    const input = {
      paths: ['field1', 'field2', 'field3']
    };

    expect(transformWellKnownTypes(input)).toBe('field1,field2,field3');
  });

  it('should handle Any type', () => {
    const input = {
      typeUrl: 'type.googleapis.com/google.protobuf.StringValue',
      value: { value: 'test' }
    };

    const expected = {
      '@type': 'type.googleapis.com/google.protobuf.StringValue',
      value: 'test'
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should recursively transform nested objects', () => {
    const input = {
      normal: 'value',
      struct: {
        fieldsMap: [
          ['key', { kind: 'stringValue', stringValue: 'value' }]
        ]
      },
      array: [
        { fieldsMap: [['item', { kind: 'numberValue', numberValue: 1 }]] },
        { normal: 'item' }
      ]
    };

    const expected = {
      normal: 'value',
      struct: {
        key: 'value'
      },
      array: [
        { item: 1 },
        { normal: 'item' }
      ]
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should handle null and undefined', () => {
    expect(transformWellKnownTypes(null)).toBe(null);
    expect(transformWellKnownTypes(undefined)).toBe(undefined);
  });

  it('should handle primitive values', () => {
    expect(transformWellKnownTypes('string')).toBe('string');
    expect(transformWellKnownTypes(123)).toBe(123);
    expect(transformWellKnownTypes(true)).toBe(true);
  });

  it('should transform wrapper Value objects', () => {
    const input = {
      usersList: [
        {
          name: { stringValue: 'Alice' },
          active: { boolValue: true },
          age: { numberValue: 30 },
          metadata: { nullValue: 0 },
          nested: {
            structValue: {
              fieldsMap: [
                ['key', { kind: 'stringValue', stringValue: 'value' }]
              ]
            }
          }
        }
      ]
    };

    const expected = {
      usersList: [
        {
          name: 'Alice',
          active: true,
          age: 30,
          metadata: null,
          nested: {
            key: 'value'
          }
        }
      ]
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should handle mixed wrapper and non-wrapper formats', () => {
    const input = {
      // Wrapper format
      name: { stringValue: 'test' },
      // Regular value
      normalField: 'normal',
      // Nested wrapper
      details: {
        enabled: { boolValue: false },
        count: { numberValue: 10 }
      }
    };

    const expected = {
      name: 'test',
      normalField: 'normal',
      details: {
        enabled: false,
        count: 10
      }
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should handle listValue with nested valuesList structure', () => {
    const input = {
      itemsList: [
        {
          timestamp: { numberValue: 1234567890 },
          title: { stringValue: 'Example' },
          tags: {
            listValue: {
              valuesList: [
                { stringValue: 'tag1' },
                { stringValue: 'tag2' },
                { numberValue: 42 }
              ]
            }
          },
          description: { stringValue: 'A sample item' },
          priority: { numberValue: 1 }
        }
      ]
    };

    const expected = {
      itemsList: [
        {
          timestamp: 1234567890,
          title: 'Example',
          tags: ['tag1', 'tag2', 42],
          description: 'A sample item',
          priority: 1
        }
      ]
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should handle complex nested structures with all Well-Known Types', () => {
    const input = {
      metadata: {
        count: 100,
        page: 1
      },
      itemsList: [],
      entitiesList: [
        {
          id: { stringValue: "entity-123" },
          enabled: { boolValue: false },
          readonly: { boolValue: true },
          type: { numberValue: 1 },
          label: { stringValue: "Sample Entity" },
          defaultValue: { nullValue: 0 },
          format: { numberValue: 0 },
          allowedTypes: {
            listValue: {
              valuesList: []
            }
          },
          settings: {
            structValue: {
              fieldsMap: [
                ['theme', { stringValue: 'dark' }],
                ['fontSize', { numberValue: 14 }]
              ]
            }
          }
        }
      ]
    };

    const expected = {
      metadata: {
        count: 100,
        page: 1
      },
      itemsList: [],
      entitiesList: [
        {
          id: "entity-123",
          enabled: false,
          readonly: true,
          type: 1,
          label: "Sample Entity",
          defaultValue: null,
          format: 0,
          allowedTypes: [],
          settings: {
            theme: 'dark',
            fontSize: 14
          }
        }
      ]
    };

    const result = transformWellKnownTypes(input);
    expect(result).toEqual(expected);
  });

  it('should handle fieldsMap with wrapper values instead of StructValues', () => {
    const input = {
      fieldsMap: [
        ['field1', { stringValue: 'text' }],
        ['field2', { numberValue: 100 }],
        ['field3', { boolValue: false }],
        ['field4', { nullValue: 0 }],
        ['field5', { 
          listValue: { 
            valuesList: [
              { stringValue: 'a' },
              { numberValue: 1 },
              { boolValue: true }
            ] 
          }
        }]
      ]
    };

    const expected = {
      field1: 'text',
      field2: 100,
      field3: false,
      field4: null,
      field5: ['a', 1, true]
    };

    expect(transformWellKnownTypes(input)).toEqual(expected);
  });

  it('should remove List suffix from arrays when option is enabled', () => {
    const input = {
      itemsList: ['a', 'b', 'c'],
      usersList: [
        { name: { stringValue: 'John' } }
      ]
    };

    const withRemoveList = transformWellKnownTypes(input, { removeListSuffix: true });
    expect(withRemoveList).toEqual({
      items: ['a', 'b', 'c'],
      users: [
        { name: 'John' }
      ]
    });

    const withoutRemoveList = transformWellKnownTypes(input, { removeListSuffix: false });
    expect(withoutRemoveList).toEqual({
      itemsList: ['a', 'b', 'c'],
      usersList: [
        { name: 'John' }
      ]
    });
  });

  it('should only remove List suffix from arrays, not other fields', () => {
    const input = {
      itemsList: ['a', 'b', 'c'],  // Should become 'items'
      todoList: 'My shopping list', // Should stay 'todoList' (not an array)
      tasksList: [],               // Should become 'tasks'
      checklist: { item: 'value' }, // Should stay 'checklist' (not ending with 'List')
      usersList: [                 // Should become 'users'
        { name: { stringValue: 'John' } }
      ]
    };

    const expected = {
      items: ['a', 'b', 'c'],
      todoList: 'My shopping list',
      tasks: [],
      checklist: { item: 'value' },
      users: [
        { name: 'John' }
      ]
    };

    expect(transformWellKnownTypes(input, { removeListSuffix: true })).toEqual(expected);
  });
});
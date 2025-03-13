export const stringifyPreview = (object: any, length: number): string => {
  if (object === null) return JSON.stringify(object);
  else if (typeof object === "boolean") return JSON.stringify(object);
  else if (typeof object === "number") return JSON.stringify(object);
  else if (typeof object === "string") return JSON.stringify(object);
  else if (Array.isArray(object)) {
    if (object.length === 0) return "[]";

    let i = 0;
    let stringified = "[";
    while (stringified.length < length && i < object.length) {
      stringified += stringifyPreview(object[i++], length - stringified.length);
      stringified += ",";
    }
    return stringified.slice(0, -1).concat("]");
  } else {
    const sortedKeys = Object.keys(object).sort() as (keyof typeof object)[];
    if (sortedKeys.length === 0) return "{}";

    let i = 0;
    let stringified = "{";
    while (stringified.length < length && i < sortedKeys.length) {
      const key = sortedKeys[i++]!;
      stringified += JSON.stringify(key);
      stringified += ":";
      stringified += stringifyPreview(object[key], length - stringified.length);
      stringified += ",";
    }
    return stringified.slice(0, -1).concat("}");
  }
};

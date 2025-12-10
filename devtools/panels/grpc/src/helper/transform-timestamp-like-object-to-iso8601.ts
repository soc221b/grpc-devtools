type TimestampLike = { seconds: number | string; nanos: number | string };

function isTimestampLike(x: unknown): x is TimestampLike {
  if (typeof x !== "object" || x === null || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;
  return (
    "seconds" in o &&
    "nanos" in o &&
    (typeof o['seconds'] === "number" || typeof o['seconds'] === "string") &&
    (typeof o['nanos'] === "number" || typeof o['nanos'] === "string")
  );
}

export function transformTimestampLikeObjectToISO8601<T>(object: T): T {
  if (object === null || object === undefined) return object;
  if (typeof object !== "object") return object;

  // If the object itself is a TimestampLike, convert it directly.
  if (isTimestampLike(object)) {
    const seconds = typeof (object as TimestampLike).seconds === "string"
      ? Number((object as TimestampLike).seconds)
      : (object as TimestampLike).seconds;
    const nanos = typeof (object as TimestampLike).nanos === "string"
      ? Number((object as TimestampLike).nanos)
      : (object as TimestampLike).nanos;
    if (!Number.isNaN(Number(seconds)) && !Number.isNaN(Number(nanos))) {
      const s = Number(seconds);
      const n = Number(nanos);
      return new Date(s * 1000 + Math.floor(n / 1e6)).toISOString() as unknown as unknown as T;
    }
  }

  if (Array.isArray(object)) {
    return object.map((item) => transformTimestampLikeObjectToISO8601(item)) as unknown as T;
  }

  const out: Record<string, unknown> = { ...(object as Record<string, unknown>) };
  for (const key of Object.keys(out)) {
    const value = out[key];
    if (isTimestampLike(value)) {
      const seconds = typeof value.seconds === "string" ? Number(value.seconds) : value.seconds;
      const nanos = typeof value.nanos === "string" ? Number(value.nanos) : value.nanos;
      if (!Number.isNaN(seconds) && !Number.isNaN(nanos)) {
        out[key] = new Date(seconds * 1000 + Math.floor(nanos / 1e6)).toISOString();
        continue;
      }
    }
    out[key] = transformTimestampLikeObjectToISO8601(value as unknown as T);
  }

  return out as unknown as T;
}

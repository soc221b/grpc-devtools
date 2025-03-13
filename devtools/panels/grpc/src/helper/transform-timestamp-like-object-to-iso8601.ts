export const transformTimestampLikeObjectToISO8601 = <T>(object: T): T => {
  if (object === null) return object;
  if (typeof object !== "object") return object;

  object = Array.isArray(object)
    ? [
        ...object,
      ]
    : { ...object };
  for (const key of Object.keys(object) as (keyof object)[]) {
    const value = object[key];
    if (
      value !== null &&
      typeof value === "object" &&
      Object.keys(value).length === 2 &&
      Object.keys(value).includes("seconds") &&
      Object.keys(value).includes("nanos")
    ) {
      const timestamp = value as unknown as { seconds: number; nanos: number };
      (object as any)[key] = new Date(
        timestamp.seconds * 1000 + Math.floor(timestamp.nanos / 1e6),
      ).toISOString();
    } else {
      object[key] = transformTimestampLikeObjectToISO8601(object[key]);
    }
  }
  return object;
};

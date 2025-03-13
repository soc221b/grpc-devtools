import { useEffect, useRef, useState } from "react";

export const useThrottle = <T>(value: T, delay: number) => {
  const [
    throttledValue,
    setThrottledValue,
  ] = useState(value);
  const lastId = useRef<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      setThrottledValue(value);
      lastId.current = null;
    }, delay);
    if (lastId.current === null) {
      lastId.current = id;
    }
    return () => {
      if (lastId.current === id) return;

      clearTimeout(id);
    };
  }, [
    value,
    delay,
  ]);
  return throttledValue;
};

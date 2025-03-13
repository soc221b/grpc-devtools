import { storage } from "@/storage";
import { get } from "lodash";
import { useEffect, useMemo } from "react";

type UsePersistReducerState = <T>(
  state: unknown,
  path: string[],
  onHydrate: (value: T) => void,
) => void;

export const usePersistReducerState: UsePersistReducerState = (state, path, onHydrate): void => {
  const key = JSON.stringify(path);
  const value = useMemo(
    () => get(state, path),
    [
      state,
    ],
  );

  // rehydrate
  useEffect(() => {
    storage.get(key).then((maybePersistedValueString) => {
      if (maybePersistedValueString === null) return;
      onHydrate(JSON.parse(maybePersistedValueString));
    });
  }, []);

  // persist
  useEffect(() => {
    storage.set(key, JSON.stringify(value));
  }, [
    value,
  ]);
};

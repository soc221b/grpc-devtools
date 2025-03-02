import { useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { isOSWindows } from "@/helper/ua";
import { useEvent } from "react-use";

export const useHotkeyMetaK = () => {
  const requestRowsDispatch = useRequestRowsDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (isOSWindows()) {
      if (e.ctrlKey && e.key === "k") {
        requestRowsDispatch({ type: "clearedAll" });
        e.stopPropagation();
      }
    } else {
      if (e.metaKey && e.key === "k") {
        requestRowsDispatch({ type: "clearedAll" });
        e.stopPropagation();
      }
    }
  });
};

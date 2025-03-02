import { useConfigDispatch } from "@/contexts/config-context";
import { isOSWindows } from "@/helper/ua";
import { useEvent } from "react-use";

export const useHotkeyMetaE = () => {
  const configDispatch = useConfigDispatch();
  useEvent("keydown", (e: KeyboardEvent) => {
    if (isOSWindows()) {
      if (e.ctrlKey && e.key === "e") {
        configDispatch({ type: "toggledShouldRecord" });
        e.stopPropagation();
      }
    } else {
      if (e.metaKey && e.key === "e") {
        configDispatch({ type: "toggledShouldRecord" });
        e.stopPropagation();
      }
    }
  });
};

import { isOSWindows } from "@/helper/ua";
import { useLayoutEffect } from "react";

export const useDisableChromeDevtoolsFind = () => {
  useLayoutEffect(() => {
    document.documentElement.addEventListener("keydown", (e: KeyboardEvent) => {
      if (isOSWindows()) {
        if (e.ctrlKey && e.key === "f") {
          e.stopPropagation();
        }
      } else {
        if (e.metaKey && e.key === "f") {
          e.stopPropagation();
        }
      }
    });
  }, []);
};

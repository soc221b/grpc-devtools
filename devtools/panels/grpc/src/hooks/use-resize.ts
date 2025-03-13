import { useCallback } from "react";

export const useResize = (
  resizeContainer: React.RefObject<HTMLDivElement> | undefined,
  direction: "x" | "y",
): React.MouseEventHandler<HTMLDivElement> => {
  return useCallback(
    (e) => {
      const clientKey = direction === "x" ? "clientX" : "clientY";
      const offsetKey = direction === "x" ? "offsetWidth" : "offsetHeight";
      const styleKey = direction === "x" ? "width" : "height";

      let lastClient = e[clientKey];
      const handleMouseMove = (e: MouseEvent) => {
        if (!resizeContainer) return;
        if (!resizeContainer.current) return;

        const delta = e[clientKey] - lastClient;
        const next = resizeContainer.current[offsetKey] + delta;
        resizeContainer.current.style[styleKey] = next + "px";
        lastClient = e[clientKey];
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", handleMouseMove);
        },
        {
          once: true,
        },
      );

      e.preventDefault();
    },
    [
      resizeContainer,
    ],
  );
};

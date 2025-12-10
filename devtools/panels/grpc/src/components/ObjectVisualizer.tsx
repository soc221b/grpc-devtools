import stringify from "json-stable-stringify";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { ObjectInspector, chromeDark, chromeLight } from "react-inspector";
import { useMeasure, useMedia } from "react-use";

const customizedTheme = {
  BASE_BACKGROUND_COLOR: "transparent",
  BASE_FONT_SIZE: "11px",
  BASE_LINE_HEIGHT: "16px",
  TREENODE_FONT_SIZE: "11px",
  TREENODE_LINE_HEIGHT: "16px",
};
const customizedChromeLight = {
  ...chromeLight,
  ...customizedTheme,
  OBJECT_NAME_COLOR: "#8E004B",
  OBJECT_VALUE_NULL_COLOR: "#AAAAAA",
  OBJECT_VALUE_STRING_COLOR: "#DC372E",
  OBJECT_VALUE_NUMBER_COLOR: "#0842A0",
  OBJECT_VALUE_BOOLEAN_COLOR: "#0842A0",
};
const customizedChromeDark = {
  ...chromeDark,
  ...customizedTheme,
  OBJECT_NAME_COLOR: "#7CACF8",
  OBJECT_VALUE_NULL_COLOR: "#6F6F6F",
  OBJECT_VALUE_STRING_COLOR: "#5CD5FB",
  OBJECT_VALUE_NUMBER_COLOR: "#9980FF",
  OBJECT_VALUE_BOOLEAN_COLOR: "#9980FF",
};

const ObjectVisualizer: React.FC<{ object: unknown; rootName?: string }> = ({ object, rootName }) => {
  const [data, setData] = useState<unknown>(object);
  const safeStableStringify = (v: unknown) => {
    try {
      return stringify(v as any);
    } catch {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
  };
  if (safeStableStringify(object) !== safeStableStringify(data)) {
    setData(object);
  }
  useLayoutEffect(() => {
    document.querySelector(".object-visualizer")?.scrollTo(0, 0);
  }, [
    data,
  ]);

  const isPreferDark = useMedia("(prefers-color-scheme: dark)");
  const theme = isPreferDark ? customizedChromeDark : customizedChromeLight;

  const [
    containerRef,
    { height: containerHeight },
  ] = useMeasure<HTMLDivElement>();

  const Inspector = useMemo(() => {
    return (
      <ObjectInspector
        expandLevel={10}
        sortObjectKeys={true}
        theme={theme as any}
        data={data as any}
        name={rootName}
      />
    );
  }, [data, theme, rootName]);
  const container = useMemo(() => {
    return (
      <div
        ref={containerRef}
        className={
          "object-visualizer whitespace-nowrap overflow-scroll" +
          (isPreferDark ? " dark" : " light")
        }
      >
        <div className="pl-1 w-fit" style={{ paddingBottom: `calc(${containerHeight}px - 18px)` }}>
          {Inspector}
        </div>
      </div>
    );
  }, [containerHeight, Inspector, isPreferDark]);
  return container;
};
export default ObjectVisualizer;

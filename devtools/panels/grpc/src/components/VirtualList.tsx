import { KeyboardStrategyBuilder } from "@/helper/keyboard-strategy-builder";
import { selectKeyboardStrategy } from "@/helper/select-keyboard-strategy";
import React, { useCallback, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

const VirtualList = ({
  id,
  data,
  currentIndex,
  renderItem,
  style,
  className,
  onDone,
  overscan,
  onFocus,
  onBlur,
  itemSize,
  ...attrs
}: {
  id?: string;
  data: unknown[];
  currentIndex: number | null;
  renderItem: (index: number, scrollIntoView: () => void) => JSX.Element;
  style?: React.CSSProperties;
  className?: string;
  onDone?: (index: number) => void;
  overscan?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  itemSize?: () => number;
}) => {
  const virtusoRef = useRef<VirtuosoHandle>(null);
  const [
    listRef,
    setListRef,
  ] = useState<HTMLElement | Window | null>(null);
  const handleScrollerKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (
        selectKeyboardStrategy([
          new KeyboardStrategyBuilder("windows").withKey("Home").build(),
          new KeyboardStrategyBuilder("macos").withMeta().withKey("ArrowUp").build(),
        ]).isPressed(e)
      ) {
        e.preventDefault();
        const firstIndex = 0;
        onDone?.(firstIndex);
        scrollIntoView({
          index: firstIndex,
        });
      } else if (
        selectKeyboardStrategy([
          new KeyboardStrategyBuilder("windows").withKey("End").build(),
          new KeyboardStrategyBuilder("macos").withMeta().withKey("ArrowDown").build(),
        ]).isPressed(e)
      ) {
        e.preventDefault();
        const lastIndex = data.length - 1;
        onDone?.(lastIndex);
        scrollIntoView({
          index: lastIndex,
        });
      } else if (
        selectKeyboardStrategy([
          new KeyboardStrategyBuilder("windows").withKey("ArrowUp").build(),
          new KeyboardStrategyBuilder("macos").withKey("ArrowUp").build(),
        ]).isPressed(e)
      ) {
        e.preventDefault();
        if (currentIndex === 0) return;
        const prevIndex =
          currentIndex === -1 || currentIndex === null ? data.length - 1 : currentIndex - 1;

        onDone?.(prevIndex);
        scrollIntoView({ index: prevIndex });
      } else if (
        selectKeyboardStrategy([
          new KeyboardStrategyBuilder("windows").withKey("ArrowDown").build(),
          new KeyboardStrategyBuilder("macos").withKey("ArrowDown").build(),
        ]).isPressed(e)
      ) {
        e.preventDefault();
        if (currentIndex === data.length - 1) return;
        const nextIndex = (currentIndex ?? -1) + 1;

        onDone?.(nextIndex);
        scrollIntoView({ index: nextIndex });
      }
    },
    [
      virtusoRef,
      data,
      onDone,
    ],
  );
  function scrollIntoView({ index }: { index: number }) {
    setTimeout(() => {
      virtusoRef.current?.scrollIntoView({
        index,
        behavior: "auto",
      });
    });
  }
  const scrollerRef = React.useCallback(
    (element: HTMLElement | Window | null) => {
      if (element) {
        setListRef(element);
        listRef?.addEventListener("keydown", handleScrollerKeydown as any);
      } else {
        listRef?.removeEventListener("keydown", handleScrollerKeydown as any);
      }
    },
    [
      handleScrollerKeydown,
    ],
  );

  return (
    <Virtuoso
      id={id}
      ref={virtusoRef}
      style={style}
      className={className}
      totalCount={data.length}
      itemContent={(index) => renderItem(index, () => scrollIntoView({ index }))}
      scrollerRef={scrollerRef}
      increaseViewportBy={overscan ?? 0}
      onFocus={onFocus}
      onBlur={onBlur}
      itemSize={itemSize ?? ((el) => el.getBoundingClientRect().height)}
      {...attrs}
    />
  );
};
export default VirtualList;

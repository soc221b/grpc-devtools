import { useDetail } from "@/contexts/detail-context";
import { RequestRow } from "@/entities/request-row";
import { useDetailRequestId } from "@/hooks/use-detail-request-id";
import { VirtualElement } from "@popperjs/core";
import React, { useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useClickAway, useEvent, useToggle } from "react-use";
import ContextMenu from "./request-row/ContextMenu";

const RequestRow = ({
  className,
  onPointerDown,
  requestRow,
  ...attrs
}: {
  className?: React.InputHTMLAttributes<HTMLDivElement>["className"];
  onPointerDown?: React.InputHTMLAttributes<HTMLDivElement>["onPointerDown"];
  requestRow: RequestRow;
}) => {
  const detail = useDetail();
  const [
    ,
    setDetailRequestId,
  ] = useDetailRequestId();
  const handlePointerDown: React.DOMAttributes<HTMLDivElement>["onPointerDown"] = (e) => {
    onPointerDown?.(e);

    if (requestRow.id === detail.requestId) return;
    setDetailRequestId(requestRow.id);
  };

  const [
    popperElement,
    setPopperElement,
  ] = useState(null);
  const [
    isContextMenuVisible,
    toggleIsContextMenuVisible,
  ] = useToggle(false);
  const [
    virtualElement,
    setVirtualElement,
  ] = useState({
    getBoundingClientRect: generateGetBoundingClientRect(),
  });
  const lastMouseMoveEvent = useRef({ clientX: 0, clientY: 0 });
  useEvent("mousemove", (e) => {
    lastMouseMoveEvent.current = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  });
  const handleContextMenu: React.DOMAttributes<HTMLDivElement>["onContextMenu"] = (e) => {
    setVirtualElement({
      getBoundingClientRect: generateGetBoundingClientRect(
        lastMouseMoveEvent.current.clientX,
        lastMouseMoveEvent.current.clientY,
      ),
    });
    toggleIsContextMenuVisible(true);
    e.preventDefault();
  };
  const { styles, attributes } = usePopper(virtualElement, popperElement);
  useClickAway({ current: popperElement }, () => {
    toggleIsContextMenuVisible(false);
  });

  return (
    <div className="relative" {...attrs}>
      <div
        className={
          "mb-[1px] px-2 py-1 text-ellipsis overflow-hidden whitespace-nowrap " + className
        }
        onPointerDown={handlePointerDown}
        onContextMenu={handleContextMenu}
      >
        {requestRow.methodName}
      </div>

      {isContextMenuVisible && (
        <section
          ref={setPopperElement}
          className="z-50"
          style={styles.popper}
          {...attributes.popper}
        >
          <ContextMenu
            requestRow={requestRow}
            close={() => toggleIsContextMenuVisible(false)}
          ></ContextMenu>
        </section>
      )}
    </div>
  );
};

export default RequestRow;

function generateGetBoundingClientRect(x = 0, y = 0): VirtualElement["getBoundingClientRect"] {
  const contextMenuWidth = 53;

  return () => ({
    width: contextMenuWidth,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
    x,
    y,
    toJSON: () => "",
  });
}

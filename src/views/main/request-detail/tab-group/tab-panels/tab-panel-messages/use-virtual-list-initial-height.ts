import { RefObject, useState } from "react";
import { useEvent } from "react-use";
import { useDetail } from "@/contexts/detail-context";
import useRequestRow from "@/hooks/use-request-row";

const numberOfMessages = 3;
export const defaultMessagesVirtualListInitialHeight = (24 + 1) * numberOfMessages + 1;
let initialMessagesVirtualListInitialHeight = defaultMessagesVirtualListInitialHeight;

export const useVirtualListInitialHeight = ({
  container,
}: {
  container: RefObject<HTMLElement>;
}) => {
  const detail = useDetail();
  const requestRow = useRequestRow();
  const [MessagesVirtualListInitialHeight, setMessagesVirtualListInitialHeight] = useState(
    initialMessagesVirtualListInitialHeight,
  );
  useEvent("mouseup", () => {
    if (requestRow === null) return;
    if (detail.messages.focusedIndex === null) return;
    if (requestRow.messages.length <= detail.messages.focusedIndex) return;
    if (container.current === null) return;
    const height = getComputedStyle(container.current).height;
    const parsedHeight = parseFloat(height);
    if (isNaN(parsedHeight)) return;
    if (MessagesVirtualListInitialHeight === parsedHeight) return;

    setMessagesVirtualListInitialHeight(parsedHeight);
    initialMessagesVirtualListInitialHeight = parsedHeight;
  });

  return MessagesVirtualListInitialHeight;
};

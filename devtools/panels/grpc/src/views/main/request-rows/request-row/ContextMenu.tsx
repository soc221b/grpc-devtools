import { RequestRow } from "@/entities/request-row";
import React from "react";
import { useCopyToClipboard } from "react-use";

const ContextMenu = ({ requestRow, close }: { requestRow: RequestRow; close: () => void }) => {
  const [
    _,
    copy,
  ] = useCopyToClipboard();
  const handleClick = () => {
    copy(
      `
{
  "serviceName": ${JSON.stringify(requestRow.serviceName)},
  "methodName": ${JSON.stringify(requestRow.methodName)},
  "requestMetadata": ${stringifyAndIndent(requestRow.requestMetadata)},
  "responseMetadata": ${stringifyAndIndent(requestRow.responseMetadata)},
  "errorMetadata": ${stringifyAndIndent(requestRow.errorMetadata)},
  "messages": ${stringifyAndIndent(requestRow.messages)}
}
    `.trim(),
    );
    function stringifyAndIndent(value: any) {
      return (
        JSON.stringify(value, null, 2)
          ?.split("\n")
          .map((line, index) => (index === 0 ? line : `  ${line}`))
          .join("\n") ?? null
      );
    }
    close();
  };

  return (
    <ul className="p-1 border border-[#cbcdd1] dark:border-[#4a4c50] text-[#303942] dark:text-[#bec6cf] rounded-sm bg-[#f1f3f4] dark:bg-[#292a2d] shadow-sm">
      <li>
        <button
          type="button"
          className="py-1 px-2 text-[#303942] dark:text-[#bec6cf] hover:bg-[#dfe1e5] dark:hover:bg-[#35363a] rounded-sm"
          onClick={handleClick}
        >
          Copy
        </button>
      </li>
    </ul>
  );
};

export default ContextMenu;

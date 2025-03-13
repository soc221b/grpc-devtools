import { RequestRow } from "@/entities/request-row";

export function isEOFMessage(focusedMessage: RequestRow["messages"][number]): boolean {
  return (
    focusedMessage.data["EOF"] === focusedMessage.timestamp &&
    Object.keys(focusedMessage.data).length === 1
  );
}

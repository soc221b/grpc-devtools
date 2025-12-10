import type { RequestRow } from "@/entities/request-row";

type Message = RequestRow["messages"][number];

export function mapMessagesToMutable(messages: ReadonlyArray<Readonly<Message>>): Message[] {
  return messages.map((m) => {
    if (m && typeof m === "object") {
      const msg = m as Readonly<Message>;
      return {
        type: msg.type,
        data: msg.data ? { ...(msg.data as Record<string, unknown>) } : {},
        timestamp: msg.timestamp,
      } as Message;
    }
    return m as unknown as Message;
  });
}

export function mapRequestRowsToMutable(rows: ReadonlyArray<Readonly<RequestRow>>): RequestRow[] {
  return rows.map((r) => {
    const rr = r as Readonly<RequestRow>;
    return {
      id: String(rr.id),
      methodName: String(rr.methodName),
      serviceName: String(rr.serviceName),
      requestMetadata: rr.requestMetadata ? { ...(rr.requestMetadata as Record<string, string>) } : {},
      responseMetadata: rr.responseMetadata ? { ...(rr.responseMetadata as Record<string, string>) } : undefined,
      errorMetadata: rr.errorMetadata ? { ...(rr.errorMetadata as Record<string, string>) } : undefined,
      messages: mapMessagesToMutable(rr.messages as ReadonlyArray<Readonly<Message>>),
    } as RequestRow;
  });
}

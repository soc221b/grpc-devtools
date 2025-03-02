export type RequestRow = {
  id: string;
  methodName: string;
  serviceName: string;
  requestMetadata: Record<string, string>;
  responseMetadata?: Record<string, string>;
  errorMetadata?: Record<string, string>;
  messages: (
    | {
        type: "request";
        data: Record<string, unknown>;
        timestamp: number;
      }
    | {
        type: "response";
        data: Record<string, unknown>;
        timestamp: number;
      }
  )[];
};

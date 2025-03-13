import { useConfig } from "@/contexts/config-context";
import { useRequestRows, useRequestRowsDispatch } from "@/contexts/request-rows-context";
import { RequestRow } from "@/entities/request-row";
import { useEffect, useRef } from "react";
import { z } from "zod";

const unloadSchema = z.object({
  action: z.literal("unload"),
});

const requestRowSchema = z.object({
  id: z.string(),
  methodName: z.string().optional(),
  serviceName: z.string().optional(),
  requestMetadata: z.record(z.string()).optional(),
  responseMetadata: z.record(z.string()).optional(),
  errorMetadata: z.record(z.string()).optional(),
  requestMessage: z.record(z.unknown()).optional(),
  responseMessage: z.record(z.unknown()).optional(),
  timestamp: z.number(),
});

export const useInitialize = () => {
  const config = useConfig();

  const requestRows = useRequestRows();
  const requestRowsDispatch = useRequestRowsDispatch();

  const requestRowsRef = useRef(requestRows);
  useEffect(() => {
    requestRowsRef.current = requestRows;
  }, [
    requestRows,
  ]);
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [
    config,
  ]);
  useEffect(() => {
    if (__ENV__.MODE === "production") {
      initDevtools();
      async function initDevtools() {
        connect();
        function connect() {
          chrome.runtime.onMessage.addListener(_handleMessage);
        }
        function _handleMessage(message: any, sender: any, sendResponse: any) {
          if (message === null) return;
          if (typeof message !== "object") return;
          if (message.source !== "__gRPC_devtools__content_script__") return;
          if (typeof sendResponse !== "function") return;
          if (sender.tab.id !== chrome.devtools.inspectedWindow.tabId) return;
          if (handleRequestRow(message) || handleUnload(message)) {
            sendResponse({
              source: "__gRPC_devtools_background__",
              payload: "forwarded",
            });
          }
        }
      }
    } else if (
      __ENV__.MODE === "development" &&
      new URLSearchParams(location.search).get("random")
    ) {
      window.addEventListener("beforeunload", () => {
        if (configRef.current.shouldPreserveLog === false) {
          requestRowsDispatch({ type: "clearedAll" });
        }
      });

      Array(5000)
        .fill(null)
        .map((_, index) => {
          const responseCount = index < 2 ? 500 : index < 10 ? 50 : 1;
          const messageCount = index < 2 ? 100 : 10;
          const hasError = Math.random() > 0.95;

          return {
            id: index.toString(),
            ...(Math.random() > 0.5
              ? { methodName: `chat`, serviceName: `chat.chatService` }
              : { methodName: `user`, serviceName: `user.userService` }),
            ...(Math.random() > 0.5
              ? {
                  requestMetadata: {
                    "cache-control": "no-cache",
                    foo: "bar",
                  },
                }
              : {
                  requestMetadata: {},
                }),
            ...(Math.random() > 0.5
              ? {
                  responseMetadata: {
                    "cache-control": "no-cache",
                    foo: "bar",
                  },
                }
              : {
                  responseMetadata: {},
                }),
            messages: [
              {
                type: "request" as const,
                data: {
                  users: Array(1)
                    .fill(null)
                    .map(() => ({
                      id: index.toString(),
                      request: "foo ".repeat(10),
                    })),
                },
                timestamp: Date.now(),
              },
              ...Array(responseCount)
                .fill(null)
                .map((_, index) => ({
                  type: "response" as const,
                  data: {
                    id: index.toString(),
                    response: "foo".repeat(Math.random() * 200),
                    random: Array(messageCount)
                      .fill(null)
                      .map(() => ({
                        _id: "6575c6a91fbdd3f0ada52484",
                        index: 0,
                        guid: "42677ce4-f3b2-46e6-81eb-222041363aa2",
                        isActive: true,
                        balance: "$1,967.45",
                        picture: "http://placehold.it/32x32",
                        age: 35,
                        eyeColor: "blue",
                        name: "Cassandra Patrick",
                        gender: "female",
                        company: "AEORA",
                        email: "cassandrapatrick@aeora.com",
                        phone: "+1 (911) 404-3220",
                        address: "753 Gerritsen Avenue, Crucible, New Hampshire, 4940",
                        about:
                          "Labore consequat esse et laborum qui in esse consectetur. Deserunt sint cillum amet irure sint ullamco minim reprehenderit non. Aute proident tempor anim ut nostrud eu cillum aliqua dolor. Sit sunt ipsum consequat commodo amet officia nisi consectetur mollit occaecat esse sit.\r\n",
                        registered: "2016-06-30T06:22:50 -08:00",
                        latitude: 13.653392,
                        longitude: -168.234294,
                        tags: [
                          "voluptate",
                          "qui",
                          "exercitation",
                          "sunt",
                          "culpa",
                          "commodo",
                          "occaecat",
                        ],
                        friends: [
                          {
                            id: 0,
                            name: "Irwin Langley",
                          },
                          {
                            id: 1,
                            name: "Snider Garza",
                          },
                          {
                            id: 2,
                            name: "Crane Welch",
                          },
                        ],
                        greeting: "Hello, Cassandra Patrick! You have 8 unread messages.",
                        favoriteFruit: "apple",
                      })),
                  },
                  timestamp: Date.now(),
                })),
            ].concat([
              {
                type: "response" as const,
                data: { EOF: Date.now() } as any,
                timestamp: Date.now(),
              },
            ]),
            ...(hasError
              ? {
                  errorMetadata: {
                    "cache-control": "no-cache",
                    "content-length": "0",
                    "content-type": "application/grpc-web-text+proto",
                    "grpc-message":
                      "rpc error: code = code = Unimplemented desc = method Hello not implemented",
                    "grpc-status": "GRPC_STATUS_UNIMPLEMENTED",
                  },
                }
              : {}),
          };
        })
        .forEach((requestRow, index) => {
          setTimeout(() => {
            if (configRef.current.shouldRecord) {
              requestRowsDispatch({
                type: "updated",
                requestRow: requestRow,
              });
            }
          }, index * 10);
        });
    } else {
      window.addEventListener("message", _handleMessage);
      return () => window.removeEventListener("message", _handleMessage);
      function _handleMessage(message: MessageEvent) {
        handleRequestRow(message.data);
      }
    }

    function handleUnload(message: any) {
      if (message === null) return false;
      if (typeof message !== "object") return false;
      if (message.source !== "__gRPC_devtools__content_script__") return false;
      const result = unloadSchema.safeParse(message.payload);
      if (result.success === false) return false;

      if (configRef.current.shouldPreserveLog === false) {
        requestRowsDispatch({ type: "clearedAll" });
      }
      return true;
    }

    function handleRequestRow(message: any) {
      if (message === null) return false;
      if (typeof message !== "object") return false;
      if (message.source !== "__gRPC_devtools__content_script__") return false;
      const payloadResult = requestRowSchema.safeParse(message.payload);
      if (payloadResult.success === false) return false;

      saveRequestRow(payloadResult.data);
      return true;
    }
    function saveRequestRow(payload: any) {
      const requestRow: RequestRow = {
        id: payload.id,
        methodName: payload.methodName,
        serviceName: payload.serviceName,
        requestMetadata: payload.requestMetadata,
        responseMetadata: payload.responseMetadata,
        errorMetadata: payload.errorMetadata,
        messages: [
          ...(payload.requestMessage
            ? [
                {
                  type: "request" as const,
                  data: payload.requestMessage,
                  timestamp: payload.timestamp,
                },
              ]
            : []),
          ...(payload.responseMessage
            ? [
                {
                  type: "response" as const,
                  data: payload.responseMessage,
                  timestamp: payload.timestamp,
                },
              ]
            : []),
        ],
      };

      if (configRef.current.shouldRecord) {
        requestRowsDispatch({
          type: "updated",
          requestRow: requestRow,
        });
      }
    }
  }, []);
};

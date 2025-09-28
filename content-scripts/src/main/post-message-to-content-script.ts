let isUnloading = false;
window.addEventListener("beforeunload", () => {
  isUnloading = true;
  const message = {
    source: "__gRPC_devtools_content_scripts_main__",
    payload: {
      action: "unload",
    },
  };
  window.postMessage(message, "*");
});

export const postMessageToContentScript = ({
  id,
  methodName,
  serviceName,
  requestMessage,
  requestMetadata,
  responseMetadata,
  responseMessage,
  errorMetadata,
}: {
  id: string;
  methodName?: undefined | string;
  serviceName?: undefined | string;
  requestMessage?: undefined | unknown;
  requestMetadata?: undefined | Record<string, string>;
  responseMetadata?: undefined | Record<string, string>;
  responseMessage?: undefined | unknown;
  errorMetadata?: undefined | Record<string, string>;
}) => {
  if (isUnloading) {
    return;
  }

  const timestamp = Date.now();
  const message = JSON.parse(
    JSON.stringify(
      {
        source: "__gRPC_devtools_content_scripts_main__",
        payload: {
          id,
          timestamp,
          methodName,
          serviceName,
          requestMetadata,
          requestMessage,
          responseMetadata,
          responseMessage: responseMessage === "EOF" ? { EOF: timestamp } : responseMessage,
          errorMetadata,
        },
      },
      (_, value) => (typeof value === "bigint" ? value.toString() + "n" : value),
    ),
  );
  window.postMessage(message, "*");
};

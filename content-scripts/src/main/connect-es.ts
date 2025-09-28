import { type Interceptor } from "@connectrpc/connect";
import { postMessageToContentScript } from "./post-message-to-content-script";

export const connectEsInterceptor: Interceptor = (next) => {
  return async (req) => {
    const id = Math.random().toString(36).slice(2, 6);
    if (req.stream) {
      const originalMessage = req.message;
      const message = {
        [Symbol.asyncIterator]: () => {
          const iterator = originalMessage[Symbol.asyncIterator]();
          return {
            next: async () => {
              const { done, value } = await iterator.next();
              if (done) {
                postMessageToContentScript({
                  id,
                  methodName: req.method.name,
                  serviceName: req.service.name,
                  requestMetadata: Array.from(req.header.entries()).reduce(
                    (
                      acc,
                      [
                        key,
                        value,
                      ],
                    ) => ({ ...acc, [key]: value }),
                    {},
                  ),
                  requestMessage: "EOF",
                });
                return { done: true, value: undefined };
              }
              postMessageToContentScript({
                id,
                methodName: req.method.name,
                serviceName: req.service.name,
                requestMetadata: Array.from(req.header.entries()).reduce(
                  (
                    acc,
                    [
                      key,
                      value,
                    ],
                  ) => ({ ...acc, [key]: value }),
                  {},
                ),
                requestMessage: { ...value, $typeName: undefined, $unknown: undefined },
              });
              return { done: false, value };
            },
          };
        },
      };
      (req as any).message = message;
    } else {
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        requestMetadata: Array.from(req.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        requestMessage: { ...req.message, $typeName: undefined, $unknown: undefined },
      });
    }

    const res = await next(req);
    if (res.stream) {
      return {
        ...res,
        message: (async function* () {
          for await (const message of res.message) {
            postMessageToContentScript({
              id,
              methodName: req.method.name,
              serviceName: req.service.name,
              responseMetadata: Array.from(res.header.entries()).reduce(
                (
                  acc,
                  [
                    key,
                    value,
                  ],
                ) => ({ ...acc, [key]: value }),
                {},
              ),
              responseMessage: { ...message, $typeName: undefined, $unknown: undefined },
            });
            yield message;
          }
          postMessageToContentScript({
            id,
            methodName: req.method.name,
            serviceName: req.service.name,
            responseMetadata: Array.from(res.header.entries()).reduce(
              (
                acc,
                [
                  key,
                  value,
                ],
              ) => ({ ...acc, [key]: value }),
              {},
            ),
            responseMessage: "EOF",
          });
        })(),
      };
    } else {
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        responseMetadata: Array.from(res.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        responseMessage: { ...res.message, $typeName: undefined, $unknown: undefined },
      });
      postMessageToContentScript({
        id,
        methodName: req.method.name,
        serviceName: req.service.name,
        responseMetadata: Array.from(res.header.entries()).reduce(
          (
            acc,
            [
              key,
              value,
            ],
          ) => ({ ...acc, [key]: value }),
          {},
        ),
        responseMessage: "EOF",
      });
      return res;
    }
  };
};

import type { ConnectRouter } from "@connectrpc/connect";
import { ChatService } from "./chat_pb";
import { Subject } from "rxjs";

const userSubjects: Record<string, Subject<{ id: string; message: string }>> = {};

export default function routes(router: ConnectRouter) {
  router.service(ChatService, {
    async *onMessage(req) {
      setTimeout(() => {
        Object.values(userSubjects).forEach((userSubject) => {
          userSubject.next({
            id: "SYSTEM",
            message: `user ${req.id} joined.`,
          });
        });
      });
      const asyncIterator = toAsyncIterator((userSubjects[req.id] = new Subject()));
      yield* asyncIterator;
    },
    sendMessage(req) {
      if (req.message.includes("leave")) {
        Object.values(userSubjects).forEach((userSubject) => {
          userSubject.next({
            id: "SYSTEM",
            message: `user ${req.id} leaved.`,
          });
        });
        userSubjects[req.id].complete();
        delete userSubjects[req.id];
        return {};
      } else {
        Object.values(userSubjects).forEach((userSubject) => {
          userSubject.next({ id: req.id, message: req.message });
        });
        return {};
      }
    },
  });
}

function toAsyncIterator<T>(subject: Subject<T>): AsyncIterable<T, undefined> {
  return {
    [Symbol.asyncIterator]: () => {
      let next: T[] = [];
      let complete = false;
      let error: any;
      subject.subscribe({
        next: (value) => {
          next.push(value);
        },
        complete: () => {
          complete = true;
        },
        error: (err) => {
          error = err;
        },
      });

      return {
        async next() {
          while (true) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            if (next.length) {
              return { value: next.shift()!, done: false };
            }
            if (complete) {
              return { value: undefined, done: true };
            }
            if (error) {
              throw error;
            }
          }
        },
      };
    },
  };
}

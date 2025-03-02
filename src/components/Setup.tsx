import React, { useState } from "react";
import { useEvent, useLocalStorage, useToggle } from "react-use";
import Checkbox from "./Checkbox";

const Setup = () => {
  const [shouldShow, toggleShouldShow] = useToggle(false);
  const [shouldShowThisAgain, setShouldShowThisAgain] = useLocalStorage(
    "sign-in-hint-got-it",
    true,
  );
  const [shouldShowThisNow, toggleShouldShowThisNow] = useState(shouldShowThisAgain);
  const open = () => {
    toggleShouldShow(true);
    toggleShouldShowThisNow(shouldShowThisAgain);
  };
  const close = () => {
    toggleShouldShow(false);
    toggleShouldShowThisNow(false);
  };
  useEvent(
    "keydown",
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && (shouldShow || shouldShowThisNow)) {
        close();
        e.stopPropagation();
      }
    },
    undefined,
    { capture: true },
  );

  const grpcDevtoolsCode = `
import type { StreamInterceptor, UnaryInterceptor } from "grpc-web";

declare const __gRPC_devtools__:
  | undefined
  | {
      gRPCDevtoolsUnaryInterceptor: UnaryInterceptor<unknown, unknown>;
      gRPCDevtoolsStreamInterceptor: StreamInterceptor<unknown, unknown>;
    };

export const gRPCDevtoolsUnaryInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsUnaryInterceptor] : [];
export const gRPCDevtoolsStreamInterceptors =
  typeof __gRPC_devtools__ === "object" ? [__gRPC_devtools__.gRPCDevtoolsStreamInterceptor] : [];
`.trim();

  const exampleCode = `
import { gRPCDevtoolsUnaryInterceptors, gRPCDevtoolsStreamInterceptors } from "./grpc-devtools";

const client = new ChatServiceClient(host, creds, {
  unaryInterceptors: gRPCDevtoolsUnaryInterceptors,
  streamInterceptors: gRPCDevtoolsStreamInterceptors,
});
    `.trim();

  return (
    <>
      <button
        type="button"
        className={
          "mx-0.5 hover:text-[#202124] dark:hover:text-[#e8eaed] hover:focus-visible-[#202124] dark:focus-visible:text-[#e8eaed] text-[#5f6367] dark:text-[#9aa0a6] underline cursor-pointer"
        }
        onClick={() => open()}
        data-setup-open
        data-setup-state={shouldShow || shouldShowThisNow}
      >
        Setup
      </button>

      {(shouldShow || shouldShowThisNow) && (
        <div
          className={
            "z-50 fixed inset-0 flex justify-center items-center overflow-hidden bg-white backdrop-blur-sm text-[#5f6367] dark:text-[#9aa0a6] dark:bg-[#292a2d]/50 text-base select-text"
          }
          data-setup-dialog
        >
          <div className="relative max-w-[90%] max-h-[90%] border border-[#767676] dark:border-[#858585] rounded-sm shadow-sm bg-[#f1f3f4] dark:bg-[#292a2d] p-2 overflow-y-auto">
            <h1 className="text-[#5f6367] dark:text-[#9aa0a6] text-lg">Setup</h1>
            <p className="mt-4">
              Bind&nbsp;
              <a
                target="_blank"
                href="https://grpc.io/blog/grpc-web-interceptor"
                className="text-[#303942] dark:text-[#bec6cf] underline"
              >
                gRPC-Web Interceptors
              </a>
              &nbsp;to a client:
            </p>
            grpc-devtools.ts
            <textarea
              disabled
              rows={grpcDevtoolsCode.split("\n").length + 1}
              className="mt-2 p-1 bg-[#ffffff] dark:bg-[#202124] overflow-x-auto w-full whitespace-pre"
            >
              {grpcDevtoolsCode}
            </textarea>
            example.ts
            <textarea
              disabled
              rows={exampleCode.split("\n").length + 1}
              className="mt-2 p-1 bg-[#ffffff] dark:bg-[#202124] overflow-x-auto w-full whitespace-pre"
            >
              {exampleCode}
            </textarea>
            <div className="absolute top-0 right-0 m-2 flex justify-center items-center gap-2">
              {shouldShowThisNow && (
                <div data-setup-show-this-again>
                  <Checkbox
                    checked={!shouldShowThisAgain}
                    onChange={() => setShouldShowThisAgain(!shouldShowThisAgain)}
                  >
                    <span>Don't show this again</span>
                  </Checkbox>
                </div>
              )}
              <button
                onClick={close}
                className="h-7 w-7 flex justify-center items-center cursor-pointer"
                data-setup-close
              >
                <span className={"material-symbols-outlined text-[#303942] dark:text-[#bec6cf]"}>
                  close
                </span>
              </button>
            </div>
            <div className="mt-4">
              <span className="text-[yellow]">Can't see the requests?&nbsp;</span>
              If you're migrating from the&nbsp;
              <a
                href="https://chromewebstore.google.com/detail/kanmilmfkjnoladbbamlclhccicldjaj"
                target="_blank"
                className="text-[#303942] dark:text-[#bec6cf] underline"
              >
                gRPC-Web Developer Tools,
              </a>
              &nbsp;please disable it. See more info in&nbsp;
              <a
                href="https://github.com/SafetyCulture/grpc-web-devtools/issues/80"
                target="_blank"
                className="text-[#303942] dark:text-[#bec6cf] underline"
              >
                this issue
              </a>
              .
            </div>
            <p className="mt-4">
              <code>gRPC Web Devtools</code> requires at least&nbsp;
              <a
                href="https://grpc.io/blog/grpc-web-interceptor/"
                target="_blank"
                className="inline text-[#1B73E8]"
              >
                <code>grpc-web@1.1.0</code>
              </a>
              <span>
                , so make sure you upgrade your gRPC Web if you're still running an older one.
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Setup;

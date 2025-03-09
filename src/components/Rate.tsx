import React from "react";
import { useEvent, useLocalStorage } from "react-use";
import _Rate from "rc-rate";
import "./rate/index.css";

const Rate = () => {
  const [shouldShow, setShouldShow] = useLocalStorage<null | boolean>("should-ask-to-rate", null);
  const [clickCount, setClickCount] = useLocalStorage("click-count", 0);
  useEvent("click", () => {
    if (shouldShow !== null) return;
    setClickCount((clickCount ?? 0) + 1);
    if ((clickCount ?? 0) < 10_000) return;
    setShouldShow(true);
  });
  const open = () => {
    setShouldShow(false);
    window.open(
      "https://chromewebstore.google.com/detail/grpc-devtools/fohdnlaeecihjiendkfhifhlgldpeopm",
      "_blank",
    );
  };
  const close = () => {
    setClickCount(0);
    setShouldShow(null);
  };

  return shouldShow ? (
    <div className="animate__animated animate__fadeInUp z-50 fixed top-16 right-6 shadow-sm flex flex-col items-center p-5 rounded-sm text-[#202124] dark:text-[#e8eaed] bg-[#EEEFF7] dark:bg-[#282828] border border-[#CBCDD1] dark:border-[#4A4C50]">
      <div>Your feedback matters!</div>
      <div>
        Please rate us on&nbsp;
        <span className="text-[#4385F5]">G</span>
        <span className="text-[#EA4336]">o</span>
        <span className="text-[#FBBC06]">o</span>
        <span className="text-[#4385F5]">g</span>
        <span className="text-[#34A854]">l</span>
        <span className="text-[#EA4336]">e</span>
      </div>
      <_Rate className="mt-1" defaultValue={5} onChange={open}></_Rate>
      <button className="mt-5 text-[#5f6367] dark:text-[#9aa0a6] hover:underline" onClick={close}>
        Remind me later
      </button>
    </div>
  ) : (
    <></>
  );
};

export default Rate;

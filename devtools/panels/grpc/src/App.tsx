import React from "react";
import { useMeasure } from "react-use";
import Header from "./views/Header";
import Main from "./views/Main";
import Footer from "./views/Footer";
import { useThemeWithDarkBackgroundClass } from "./hooks/use-theme-with-dark-background-class";
import { useInitialize } from "./hooks/use-initialize";
import { Tooltip } from "react-tooltip";
import { useDisableChromeDevtoolsFind } from "@/hooks/use-disable-chrome-devtools-find";
import { useCloseDetailWhenNotFound } from "@/hooks/use-close-detail-when-not-found";
import { useHotkeyMetaE } from "@/hooks/use-hotkey-meta-e";
import { useHotkeyMetaK } from "@/hooks/use-hotkey-meta-k";
import { useHotkeyEscape } from "@/hooks/use-hotkey-escape";
import { useObjectVisualizerStyle } from "./hooks/use-object-visualizer-style";

const App = () => {
  useInitialize();

  useThemeWithDarkBackgroundClass();
  useObjectVisualizerStyle();

  useCloseDetailWhenNotFound();

  useDisableChromeDevtoolsFind();

  useHotkeyMetaE();
  useHotkeyMetaK();
  useHotkeyEscape();

  const [headerRef, { height: headerHeight }] = useMeasure<HTMLDivElement>();
  const [footerRef, { height: footerHeight }] = useMeasure<HTMLDivElement>();

  return (
    <div className="flex flex-col bg-[#ffffff] dark:bg-[#202124] w-screen h-screen overflow-hidden text-xs">
      <Header headerRef={headerRef}></Header>
      <Main headerHeight={headerHeight} footerHeight={footerHeight}></Main>
      <Footer footerRef={footerRef}></Footer>
      <Tooltip
        id="tooltip"
        delayShow={1000}
        delayHide={500}
        noArrow
        place="bottom"
        className="px-1! py-0.5! dark:border dark:border-[#474747] shadow-sm bg-[#EEEFF7]! dark:bg-[#282828]! text-[#474747]! dark:text-[#E3E3E3]! z-9999"
      />
    </div>
  );
};

export default App;

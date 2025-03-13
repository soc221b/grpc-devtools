import React, { useEffect, useRef } from "react";
import RequestDetail from "./main/RequestDetail";
import RequestRows from "./main/RequestRows";
import VerticalDivider from "@/components/VerticalDivider";
import { useDetail } from "@/contexts/detail-context";
import { useRequestRows } from "@/contexts/request-rows-context";
import { useDetailRequestId } from "@/hooks/use-detail-request-id";

const Main = ({ headerHeight, footerHeight }: { headerHeight: number; footerHeight: number }) => {
  const detail = useDetail();
  const requestRows = useRequestRows();
  useEffect(() => {
    resetDetailRequestIdIfRequestRowsIsEmpty();
  }, [requestRows]);
  const [, setDetailRequestId] = useDetailRequestId();
  const resetDetailRequestIdIfRequestRowsIsEmpty = () => {
    if (requestRows.length) return;
    if (detail.requestId === null) return;
    setDetailRequestId(null);
  };

  const isDetailVisible = detail.requestId !== null;

  const container = useRef<HTMLDivElement>(null);

  return (
    <main className="flex flex-col bg-[#ffffff] dark:bg-[#202124] overflow-y-auto grow">
      <div className="flex flex-row">
        <div
          ref={container}
          className={isDetailVisible ? " w-[200px] min-w-[50px]" : " w-full min-w-[100%]"}
        >
          <RequestRows headerHeight={headerHeight} footerHeight={footerHeight}></RequestRows>
        </div>

        {isDetailVisible && (
          <>
            <VerticalDivider resizeContainer={container}></VerticalDivider>
            <RequestDetail></RequestDetail>
          </>
        )}
      </div>
    </main>
  );
};

export default Main;

import React from "react";
import HorizontalDivider from "@/components/HorizontalDivider";
import { useRequestRows } from "@/contexts/request-rows-context";
import { useFilteredRequestRows } from "@/hooks/use-filtered-request-rows";

const Footer = ({
  footerRef: footerRef,
}: {
  footerRef: React.ClassAttributes<HTMLElement>["ref"] | null;
}) => {
  const requestRows = useRequestRows();

  const filteredRequestRows = useFilteredRequestRows();

  return (
    <footer ref={footerRef} className="flex flex-col bg-[#f1f3f4] dark:bg-[#292a2d]">
      <HorizontalDivider></HorizontalDivider>
      <div className="p-1">
        <div
          data-footer-status-requests
          className="flex flex-wrap items-center px-1 select-none text-[#5f6367] dark:text-[#9aa0a6]"
        >
          {requestRows.length === filteredRequestRows.length ? (
            <div>{requestRows.length} requests</div>
          ) : (
            <div>
              {filteredRequestRows.length} / {requestRows.length} requests
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

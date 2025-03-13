import React from "react";

const IconButton = (props: {
  children: JSX.Element;
  isPrimary?: boolean;
  isSecondary?: boolean;
  onClick?: () => void;
}) => {
  const { children, onClick, isPrimary, isSecondary, ...attributes } = props;

  return (
    <button
      {...attributes}
      className="group inline-flex justify-center items-center rounded-sm overflow-hidden cursor-default"
      tabIndex={0}
      onClick={onClick}
    >
      <div className="p-0.5 rounded-sm group-focus-visible:bg-[#F2F2F2] dark:group-focus-visible:bg-[#3E3E3E]">
        <div className="flex justify-center items-center p-1.5 rounded-sm group-focus-visible:bg-[#E6E6E6] dark:group-focus-visible:bg-[#525252]">
          <div
            className={
              "flex justify-center items-center w-2 h-2 transition-colors scale-75" +
              (isPrimary
                ? " text-[#DC372E] dark:text-[#E46962]"
                : isSecondary
                  ? " text-[#1C6EF3] dark:text-[#7CACF8]"
                  : " group-hover:text-[#1F1F1F] dark:group-hover:text-[#e8eaed] text-[#5f6367] dark:text-[#9aa0a6]")
            }
          >
            {props.children}
          </div>
        </div>
      </div>
    </button>
  );
};

export default IconButton;

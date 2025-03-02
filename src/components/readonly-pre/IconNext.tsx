import React from "react";

const IconPrev = ({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) => {
  return (
    <button
      className="group flex justify-center items-center w-[12px] h-[12px] m-[2px] disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={onClick}
    >
      <span
        className={
          "material-symbols-outlined scale-[0.6] text-[#5f6367] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#e8eaed]" +
          " group-disabled:text-[#bdbdbd] dark:group-disabled:text-[#525355]"
        }
      >
        expand_more
      </span>
    </button>
  );
};

export default IconPrev;

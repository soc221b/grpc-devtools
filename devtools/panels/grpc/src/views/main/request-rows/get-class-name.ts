export const getClassName = ({
  isWindowFocus,
  isActive,
  isError,
  isOdd,
}: {
  isWindowFocus: boolean;
  isActive: boolean;
  isError: boolean;
  isOdd: boolean;
}): string[] => {
  switch ((isWindowFocus ? 8 : 0) + (isActive ? 4 : 0) + (isError ? 2 : 0) + (isOdd ? 1 : 0)) {
    case 0:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#f5f5f5] dark:bg-[#292929]"];
    case 1:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#ffffff] dark:bg-[#242424]"];
    case 2:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#f5f5f5] dark:bg-[#292929]"];
    case 3:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#ffffff] dark:bg-[#242424]"];
    case 4:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#dadcd0] dark:bg-[#454545]"];
    case 5:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#dadcd0] dark:bg-[#454545]"];
    case 6:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#dadcd0] dark:bg-[#454545]"];
    case 7:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#dadcd0] dark:bg-[#454545]"];
    case 8:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#f5f5f5] dark:bg-[#292929]"];
    case 9:
      return ["text-[#303942] dark:text-[#bec6cf]", "bg-[#ffffff] dark:bg-[#242424]"];
    case 10:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#f5f5f5] dark:bg-[#292929]"];
    case 11:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#ffffff] dark:bg-[#242424]"];
    case 12:
      return ["text-[#ffffff] dark:text-[#cdcdcd]", "bg-[#1b73e8] dark:bg-[#10629d]"];
    case 13:
      return ["text-[#ffffff] dark:text-[#cdcdcd]", "bg-[#1b73e8] dark:bg-[#10629d]"];
    case 14:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#fad2cf] dark:bg-[#482422]"];
    case 15:
      return ["text-[#ef432f] dark:text-[#ed4f4c]", "bg-[#fad2cf] dark:bg-[#482422]"];
  }

  return [];
};

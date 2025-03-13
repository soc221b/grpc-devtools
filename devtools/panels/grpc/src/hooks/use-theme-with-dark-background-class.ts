import { useMedia } from "react-use";

export const useThemeWithDarkBackgroundClass = () => {
  const isPreferDark = useMedia("(prefers-color-scheme: dark)");
  if (isPreferDark) {
    document.documentElement.classList.add("-theme-with-dark-background");
  } else {
    document.documentElement.classList.remove("-theme-with-dark-background");
  }
};

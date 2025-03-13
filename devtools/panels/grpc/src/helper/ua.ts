import { UAParser } from "ua-parser-js";

const uaParser = new UAParser();

export const isOSWindows = () => {
  return uaParser.getOS().name === "Windows";
};

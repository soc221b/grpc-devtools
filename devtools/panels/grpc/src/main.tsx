import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "animate.css";
import "@/assets/index.css";
import "react-tooltip/dist/react-tooltip.css";
import { ConfigProvider } from "@/contexts/config-context";
import { FilterProvider } from "@/contexts/filter-context";
import { DetailProvider } from "@/contexts/detail-context";
import { RequestRowsProvider } from "@/contexts/request-rows-context";

let root = <App />;
root = <DetailProvider>{root}</DetailProvider>;
root = <FilterProvider>{root}</FilterProvider>;
root = <ConfigProvider>{root}</ConfigProvider>;
root = <RequestRowsProvider>{root}</RequestRowsProvider>;
root = <React.StrictMode>{root}</React.StrictMode>;

ReactDOM.createRoot(document.getElementById("root")!).render(root);

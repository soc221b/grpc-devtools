import "@/assets/index.css";
import { ConfigProvider } from "@/contexts/config-context";
import { DetailProvider } from "@/contexts/detail-context";
import { FilterProvider } from "@/contexts/filter-context";
import { RequestRowsProvider } from "@/contexts/request-rows-context";
import "animate.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App";

let root = <App />;
root = <DetailProvider>{root}</DetailProvider>;
root = <FilterProvider>{root}</FilterProvider>;
root = <ConfigProvider>{root}</ConfigProvider>;
root = <RequestRowsProvider>{root}</RequestRowsProvider>;
root = <React.StrictMode>{root}</React.StrictMode>;

ReactDOM.createRoot(document.getElementById("root")!).render(root);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import zhCN from "antd/es/locale/zh_CN";
import moment from "moment";

import "moment/dist/locale/zh-cn.js";

moment.locale("zh-cn", {
  calendar: {
    sameDay: "A h:mm",
    nextDay: "[明天]A h:mm",
    lastDay: "[昨天]A h:mm",
    nextWeek: "[下]ddddA h:mm",
    lastWeek: "[上]ddddA h:mm",
    sameElse: "YYYY.MM.DD HH:mm:ss",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

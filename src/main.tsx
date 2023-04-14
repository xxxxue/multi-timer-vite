import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { HashRouter as Router } from "react-router-dom";
import Index from "@/components/Layout/Index";

import "./utils/dayjs"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <Router>
        <Index />
      </Router>
  </React.StrictMode>
);

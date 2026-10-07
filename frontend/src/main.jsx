import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";
import { getSessionUser } from "./utils/session";
import { initializeDisplayMode } from "./utils/theme";

import "./index.css";
import "./styles/adminDesignerRefresh.css";
import "./styles/sprint4Theme.css";
import "./styles/uxPolish.css";
import "./styles/traineeFinalPolish.css";
import "./styles/certificateManagement.css";

initializeDisplayMode(
  getSessionUser()
);

const rootElement =
  document.getElementById(
    "root"
  );

if (
  !rootElement
) {
  throw new Error(
    'Root element with id "root" was not found.'
  );
}

ReactDOM.createRoot(
  rootElement
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
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
import "./styles/finalUxCorrections.css";
import "./styles/themeReadability2026.css";
import "./styles/allRolesThemeBalance.css";
import "./styles/projectWideThemeUpgrade.css";
import "./styles/finalTextMapRefinement.css";
import "./styles/themeWiseContrast2026.css";
import "./styles/lightNeutralBlackText.css";
import "./styles/accessibilityResponsiveUpgrade.css";
import "./styles/unifiedResponsiveDesign.css";
// Final map, profile uploads and dual-theme hover treatments.
import "./styles/interactiveThemeFinish.css";
// Contrast-safe admin actions, persistent notification navigation and
// themed puzzle / safety-mission surfaces (final stylesheet).
import "./styles/contrastStableImmersive2026.css";
import "./styles/simulationMissionAccessible.css";
// Dual-mode interactive floor map + independent 360-degree location preview.
import "./styles/warehouse360MapPreview.css";

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

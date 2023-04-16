import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import "./styles/fonts.css";
import GlobalStyles from "./styles/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);

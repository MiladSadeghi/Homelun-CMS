import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.css";
import "./styles/fonts.css";
import GlobalStyles from "./styles/GlobalStyles";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import setupInterceptors from "./services/setupInterceptors";
import { store } from "./feature/store";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <GlobalStyles />
    <App />
  </>
);

setupInterceptors(store);

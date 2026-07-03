import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider as CheckoutProvider } from "./hooks/context/checkoutContext";

// console.log = () => {};
// console.error = () => {};
// console.debug = () => {};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CheckoutProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CheckoutProvider>
  </React.StrictMode>
);

reportWebVitals();

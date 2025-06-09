import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ChatStateProvider } from "./context/ChatStateContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChatStateProvider>
      <App />
    </ChatStateProvider>
  </React.StrictMode>
);

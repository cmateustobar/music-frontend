import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlayerProvider } from "./context/PlayerContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#181818",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
      />
    </PlayerProvider>
  </React.StrictMode>
);
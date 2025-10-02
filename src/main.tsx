import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { FileUploadContextProvider } from "./context/FileUploadContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <FileUploadContextProvider>
        <App />
      </FileUploadContextProvider>
    </Router>
  </StrictMode>
);

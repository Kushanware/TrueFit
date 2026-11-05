import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import StoreContextProvider from "./components/Context/StoreContext.jsx";
import { StrictMode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <StoreContextProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StoreContextProvider>
  // </StrictMode>
);

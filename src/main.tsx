import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { LanguageProvider } from "./pages/organizer/components/LanguageContext.tsx";
import { SidebarProvider } from "./contexts/SideBarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthenticationProvider } from "./providers/authenticationProvider.tsx";
import { EmployeesProvider } from "./providers/EmployeesProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { EmployeeTimeRecordProvider } from "./providers/EmployeeTimeRecordProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthenticationProvider>
        <EmployeesProvider>
          <EmployeeTimeRecordProvider>
            <App />
          </EmployeeTimeRecordProvider>
        </EmployeesProvider>
      </AuthenticationProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);

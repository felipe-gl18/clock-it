import { Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginForm } from "./components/login-form";
import NotFound from "./pages/notFound";
import { RegisterForm } from "./components/register-form";
import { AuthenticationLayout } from "./layouts/AuthenticationLayout";
import { HomeLayout } from "./layouts/HomeLayout";
import ProtectedRoute from "./guards/protectedRoute";
import Graphics from "./pages/graphics";
import Home from "./pages/home";
import Employees from "./pages/employees";
import EmployeeTimeRecord from "./pages/employeeFaceRecognition";

function App() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Routes>
        <Route path="/" element={<AuthenticationLayout />}>
          <Route index element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/home" element={<Home />} />
          <Route path="settings" element={<Graphics />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        <Route path="/faceRecognition/:token">
          <Route index element={<EmployeeTimeRecord />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

import { EmployeesContext } from "@/contexts/EmployeesContext";
import { useContext } from "react";

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context)
    throw new Error("useEmployees must be used within EmployeesProvider");

  return context;
};

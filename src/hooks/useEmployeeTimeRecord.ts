import { EmployeeTimeRecordContext } from "@/contexts/EmployeeTimeRecordContext";
import { useContext } from "react";

export const useEmployeeTimeRecord = () => {
  const context = useContext(EmployeeTimeRecordContext);
  if (!context)
    throw new Error(
      "useEmployeesTimeRecord must be used within EmployeesTimeRecordProvider"
    );

  return context;
};

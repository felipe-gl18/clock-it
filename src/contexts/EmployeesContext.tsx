import { createContext } from "react";

export type Employee = {
  name: string;
  phone: string;
  email: string;
};

export type EmployeeWithId = { id: string } & Employee;

type EmployeesContextType = {
  isLoading: boolean;
  employees: EmployeeWithId[] | null;
  refreshEmployees: () => Promise<void>;
  handleGetAllEmployees: (uid: string) => Promise<Employee[] | null>;
  handleNewEmployee: (props: Employee) => Promise<string>;
  handleDeleteEmployee: (employeeId: string) => Promise<void>;
  handleUpdateEmployee: (props: Employee, employeeId: string) => Promise<void>;
  sendFaceRecognitionTokenByEmail: () => Promise<void>;
};

export const EmployeesContext = createContext<EmployeesContextType>({
  isLoading: false,
  employees: null,
  refreshEmployees: async () => {},
  handleGetAllEmployees: async () => null,
  handleNewEmployee: async () => "",
  handleDeleteEmployee: async () => {},
  handleUpdateEmployee: async () => {},
  sendFaceRecognitionTokenByEmail: async () => {},
});

import {
  EmployeesContext,
  type Employee,
  type EmployeeWithId,
} from "@/contexts/EmployeesContext";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useState, type ReactNode } from "react";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
  const {
    getAllEmployees,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    generateFaceRecognitionToken,
  } = useFirebaseStorage();
  const [employees, setEmployees] = useState<EmployeeWithId[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function refreshEmployees() {
    setIsLoading(true);
    const result = await handleGetAllEmployees();
    setEmployees(result);
    setIsLoading(false);
  }

  async function handleGetAllEmployees() {
    return await getAllEmployees();
  }

  async function handleNewEmployee(props: Employee): Promise<string> {
    return await addEmployee(props);
  }

  async function handleDeleteEmployee(employeeId: string) {
    await deleteEmployee(employeeId);
  }

  async function handleUpdateEmployee(props: Employee, employeeId: string) {
    await updateEmployee(props, employeeId);
  }

  async function sendFaceRecognitionTokenByEmail() {
    const token = await generateFaceRecognitionToken();
    const employees = await getAllEmployees();
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/faceRecognition/${token}`;

    if (!employees) return;

    employees.forEach((employee) => {
      emailjs
        .send(
          "service_i8ugxb4",
          "template_3068jmo",
          {
            to_name: employee.name,
            from_name: "ClockIt",
            reply_to: employee.email,
            link,
            email: employee.email,
          },
          "fZn_kWz9d5oL8c-Bp"
        )
        .then(() => {
          toast.success(`Email enviado para ${employee.name}`);
        })
        .catch((error) => {
          if (error instanceof Error) {
            toast.error(`Erro para ${employee.name}: ${error.message}`);
          } else {
            toast.error(`Erro ao enviar para ${employee.name}`);
          }
        });
    });
  }

  return (
    <EmployeesContext.Provider
      value={{
        isLoading,
        employees,
        handleGetAllEmployees,
        refreshEmployees,
        handleNewEmployee,
        sendFaceRecognitionTokenByEmail,
        handleDeleteEmployee,
        handleUpdateEmployee,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

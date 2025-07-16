import {
  ClockIcon,
  DollarSign,
  MailIcon,
  MessageCircleIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import EmployeeAvatar from "./employee-avatar";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import { useEmployeeTimeRecord } from "@/hooks/useEmployeeTimeRecord";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";

export default function Employee({ employee }: { employee: EmployeeWithId }) {
  const { handleMonthlyWorkedHoursAndMinutes, handleSalaryPerWorkedHours } =
    useEmployeeTimeRecord();

  const [employeeWorkedHoursAndMinutes, setEmployeeWorkedHoursAndMinutes] =
    useState<{
      hours: number;
      minutes: number;
    }>({
      hours: 0,
      minutes: 0,
    });
  const [employeeSalary, setEmployeeSalary] = useState<number>(0);

  function handleWhatsAppRedirect() {
    window.open(`https://wa.me/${employee.phone}`, "_blank");
  }

  useEffect(() => {
    const fetchWorkedHours = async () => {
      const hoursAndMinutes = await handleMonthlyWorkedHoursAndMinutes(
        employee.id
      );
      const salary = await handleSalaryPerWorkedHours(hoursAndMinutes.hours);
      setEmployeeWorkedHoursAndMinutes(hoursAndMinutes);
      setEmployeeSalary(salary);
    };
    fetchWorkedHours();
  }, [employee.id]);

  return (
    <div className="flex flex-col justify-center items-center space-y-8">
      <EmployeeAvatar employee={employee} />
      <div className="w-full space-y-6 px-6">
        <div className="flex space-x-4">
          <UserIcon />
          <p className="text-sm">{employee.name}</p>
        </div>
        <div className="flex space-x-4">
          <MailIcon />
          <p className="text-sm">{employee.email}</p>
        </div>
        <div className="flex space-x-4">
          <PhoneIcon />
          <p className="text-sm">{employee.phone}</p>
        </div>
        <Separator />
        <div className="flex space-x-4 items-center">
          <ClockIcon />
          <p className="font-bold text-gray-400 text-sm">
            {employeeWorkedHoursAndMinutes.hours} hora(s) e{" "}
            {employeeWorkedHoursAndMinutes.minutes} minuto(s) trabalhados
          </p>
        </div>
        <div className="flex space-x-4 items-center">
          <DollarSign />
          <p className="font-bold text-gray-400 text-sm">
            {employeeSalary.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <Separator />
        <div>
          <Button
            onClick={handleWhatsAppRedirect}
            variant={"outline"}
            className="cursor-pointer text-green-400 hover:bg-green-50 hover:text-green-500 w-full"
            size="lg"
          >
            <MessageCircleIcon /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}

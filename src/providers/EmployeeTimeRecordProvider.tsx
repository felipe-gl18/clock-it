import {
  EmployeeTimeRecordContext,
  type EmployeeTimeRecord,
  type EmployeeTimeRecordWithId,
} from "@/contexts/EmployeeTimeRecordContext";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useState, type ReactNode } from "react";

export const EmployeeTimeRecordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { addEmployeeTimeRecord, getAllEmployeesTimeRecords } =
    useFirebaseStorage();
  const [employeesTimeRecord, setEmployeesTimeRecord] = useState<
    EmployeeTimeRecordWithId[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function refreshEmployeesTimeRecord() {
    setIsLoading(true);
    const result = await handleEmployeesTimeRecord();
    setEmployeesTimeRecord(result!);
    setIsLoading(false);
    return result;
  }

  async function handleEmployeesTimeRecord() {
    return await getAllEmployeesTimeRecords();
  }

  async function handleNewEmployeeTimeRecord(props: EmployeeTimeRecord) {
    await addEmployeeTimeRecord(props);
  }
  async function handleUpdateEmployeeTimeRecord(clockedOut: Date, uid: string) {
    console.log(clockedOut, uid);
  }

  async function handleMonthlyWorkedHoursAndMinutes(employeeId: string) {
    const employeesTimeRecord = await refreshEmployeesTimeRecord();
    const monthlyRecords = employeesTimeRecord!.filter((record) => {
      const recordDate = record.day;
      return (
        record.employeeId === employeeId &&
        recordDate.getMonth() === new Date().getMonth() &&
        recordDate.getFullYear() === new Date().getFullYear()
      );
    });

    const totalWorkedMilliseconds = monthlyRecords.reduce((acc, record) => {
      // Garante que clockedIn e clockedOut existam e sejam válidos
      const clockedInTime = record.clockedIn?.getTime() || 0;
      const clockedOutTime = record.clockedOut?.getTime() || 0;

      // Calcula a diferença apenas se ambos os tempos existirem e clockedOut for maior que clockedIn
      const workedMilliseconds =
        clockedOutTime > clockedInTime ? clockedOutTime - clockedInTime : 0;

      return acc + workedMilliseconds;
    }, 0);

    // Calcula o total de horas
    const totalHours = Math.floor(totalWorkedMilliseconds / (1000 * 60 * 60));

    // Calcula os minutos restantes
    const remainingMilliseconds = totalWorkedMilliseconds % (1000 * 60 * 60);
    const totalMinutes = Math.round(remainingMilliseconds / (1000 * 60)); // Arredonda os minutos para o mais próximo

    return {
      hours: totalHours,
      minutes: totalMinutes,
    };
  }

  async function handleSalaryPerWorkedHours(hours: number) {
    const hourlyRate = 20; // Replace with actual logic to get employee's hourly rate
    return hours * hourlyRate;
  }

  return (
    <EmployeeTimeRecordContext.Provider
      value={{
        isLoading,
        employeesTimeRecord,
        refreshEmployeesTimeRecord,
        handleNewEmployeeTimeRecord,
        handleUpdateEmployeeTimeRecord,
        handleMonthlyWorkedHoursAndMinutes,
        handleSalaryPerWorkedHours,
      }}
    >
      {children}
    </EmployeeTimeRecordContext.Provider>
  );
};

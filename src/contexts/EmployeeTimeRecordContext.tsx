import type { Timestamp } from "firebase/firestore";
import { createContext } from "react";

export type EmployeeTimeRecordFromFirebase = {
  day: Timestamp;
  employeeId: string;
  clockedIn: Timestamp;
  clockedOut: Timestamp | null;
};

export type EmployeeTimeRecord = {
  day: Date;
  employeeId: string;
  clockedIn: Date;
  clockedOut: Date | null;
};
export type EmployeeTimeRecordWithId = {
  id: string;
} & EmployeeTimeRecord;

export type EmployeeTimeRecordContextType = {
  isLoading: boolean;
  employeesTimeRecord: EmployeeTimeRecordWithId[] | null;
  refreshEmployeesTimeRecord: () => Promise<EmployeeTimeRecordWithId[] | null>;
  handleNewEmployeeTimeRecord: (props: EmployeeTimeRecord) => Promise<void>;
  handleUpdateEmployeeTimeRecord: (
    clockedOut: Date,
    uid: string
  ) => Promise<void>;
  handleMonthlyWorkedHoursAndMinutes: (employeeId: string) => Promise<{
    hours: number;
    minutes: number;
  }>;
  handleSalaryPerWorkedHours: (hours: number) => Promise<number>;
};

export const EmployeeTimeRecordContext =
  createContext<EmployeeTimeRecordContextType>({
    isLoading: false,
    employeesTimeRecord: null,
    refreshEmployeesTimeRecord: async () => {
      return null;
    },
    handleNewEmployeeTimeRecord: async () => {},
    handleUpdateEmployeeTimeRecord: async () => {},
    handleMonthlyWorkedHoursAndMinutes: async () => {
      return { hours: 0, minutes: 0 };
    },
    handleSalaryPerWorkedHours: async () => 0,
  });

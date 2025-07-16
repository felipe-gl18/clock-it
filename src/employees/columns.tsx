import type { ColumnDef } from "@tanstack/react-table";
import { MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import EmployeeWrapper from "@/components/employee-wrapper";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import { Actions } from "./actionts";

export const columns: ColumnDef<EmployeeWithId>[] = [
  {
    accessorKey: "name",
    header: () => {
      return (
        <div className="flex items-center space-x-2">
          <UserIcon size={18} />
          <p>Name</p>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-start">
        <EmployeeWrapper employee={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => {
      return (
        <div className="flex items-center space-x-2">
          <PhoneIcon size={18} />
          <p>Phone</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("phone") as string;
      return <div className="text-start">{value}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => {
      return (
        <div className="flex items-center space-x-2">
          <MailIcon size={18} />
          <p>Email</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <div className="text-start">{value}</div>;
    },
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return <Actions employee={employee} />;
    },
  },
];

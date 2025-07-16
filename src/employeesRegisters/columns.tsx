import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarIcon,
  CheckIcon,
  LogOutIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmployeeTimeRecord } from "@/contexts/EmployeeTimeRecordContext";

export const columns: ColumnDef<EmployeeTimeRecord>[] = [
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
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <div className="text-start">{value}</div>;
    },
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
    accessorKey: "day",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <CalendarIcon size={18} />
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Day
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("day") as Date;
      const formatted = format(value, "dd/MM/yyyy");

      return <div className="text-start">{formatted}</div>;
    },
  },
  {
    accessorKey: "clockedIn",
    header: () => {
      return (
        <div className="flex items-center space-x-2">
          <CheckIcon size={18} />
          <p>Clocked In</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("clockedIn") as Date;
      const formatted = format(value, "HH:mm");
      return <div className="text-start">{formatted}</div>;
    },
  },
  {
    accessorKey: "clockedOut",
    header: () => {
      return (
        <div className="flex items-center space-x-2">
          <LogOutIcon size={18} />
          <p>Clocked out</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue("clockedOut") as Date;

      if (!value) {
        return <div className="text-start">_</div>;
      }

      const formatted = format(value, "HH:mm");
      return <div className="text-start">{formatted}</div>;
    },
  },
];

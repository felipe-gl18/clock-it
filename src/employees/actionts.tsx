import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import EmployeeUpdateWrapper from "@/components/employee-update-wrapper";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import EmployeeDeleteWrapper from "@/components/employee-delete-wrapper";
import { useState } from "react";

export function Actions({ employee }: { employee: EmployeeWithId }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setOpenDelete(true)}
          >
            <Trash />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenUpdate(true)}
          >
            <Edit />
            Update
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openDelete && (
        <EmployeeDeleteWrapper
          employeeId={employee.id}
          open={openDelete}
          onOpenChange={setOpenDelete}
        />
      )}
      {openUpdate && (
        <EmployeeUpdateWrapper
          employee={employee}
          open={openUpdate}
          onOpenChange={setOpenUpdate}
        />
      )}
    </>
  );
}

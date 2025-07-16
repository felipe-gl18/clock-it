import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import Employee from "@/components/employee";

export default function EmployeeWrapper({
  employee,
}: {
  employee: EmployeeWithId;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          {employee.name}
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-6">
        <SheetHeader>
          <SheetTitle>Employee Info</SheetTitle>
          <SheetDescription>
            Check the amount of worked hours of the employee.
          </SheetDescription>
        </SheetHeader>
        <Employee employee={employee} />
      </SheetContent>
    </Sheet>
  );
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmployeeUpdateForm } from "./employee-update-form";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
export default function EmployeeUpdateWrapper({
  employee,
  open,
  onOpenChange,
}: {
  employee: EmployeeWithId;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="space-y-6">
        <SheetHeader>
          <SheetTitle>Employee Info</SheetTitle>
          <SheetDescription>
            You can always update the employee data, but be careful with the
            photo, it is responsible for the face recognition
          </SheetDescription>
        </SheetHeader>
        <EmployeeUpdateForm employee={employee} />
      </SheetContent>
    </Sheet>
  );
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EmployeeForm } from "./employee-form";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

export default function EmployeeFormWrapper() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon />
          Add employee
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-6">
        <SheetHeader>
          <SheetTitle>Employee Info</SheetTitle>
          <SheetDescription>
            To add a new employee, you need to fill three required info, name,
            phone and email.
          </SheetDescription>
        </SheetHeader>
        <EmployeeForm />
      </SheetContent>
    </Sheet>
  );
}

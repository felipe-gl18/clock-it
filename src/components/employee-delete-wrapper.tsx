import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEmployees } from "@/hooks/useEmployees";
import { TriangleAlert } from "lucide-react";

export default function EmployeeDeleteWrapper({
  employeeId,
  open,
  onOpenChange,
}: {
  employeeId: string;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const { handleDeleteEmployee, refreshEmployees } = useEmployees();

  async function handleDelete() {
    await handleDeleteEmployee(employeeId);
    await refreshEmployees();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-2 items-center">
            <TriangleAlert className="text-orange-400" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            employee.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

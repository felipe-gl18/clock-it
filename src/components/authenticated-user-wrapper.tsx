import type { User } from "firebase/auth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import AuthenticatedUser from "./authenticated-user";

export default function AuthenticatedUserWrapper({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="space-y-6">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>
            All the informations below are from your profile. Some of them
            weren't included in the initial signup.
          </SheetDescription>
        </SheetHeader>
        <AuthenticatedUser user={user} />
      </SheetContent>
    </Sheet>
  );
}

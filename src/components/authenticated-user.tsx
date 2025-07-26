import type { User } from "firebase/auth";
import {
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import Avatar from "./avatar";

export default function AuthenticatedUser({ user }: { user: User }) {
  const { deleteUser } = useFirebaseStorage();
  return (
    <div className="flex flex-col justify-center items-center space-y-8">
      <Avatar img={user.photoURL} className="w-24 h-24" />
      <div className="w-full space-y-6 px-6">
        <div className="flex space-x-4">
          <UserIcon />
          <p className="text-sm">{user.displayName}</p>
        </div>
        <div className="flex space-x-4">
          <MailIcon />
          <p className="text-sm">{user.email}</p>
        </div>
        <div className="flex space-x-4">
          <PhoneIcon />
          {user.phoneNumber ? (
            <p className="text-sm">{user.phoneNumber}</p>
          ) : (
            <Badge variant="destructive">unknown</Badge>
          )}
        </div>
        <div className="flex space-x-4">
          <CalendarIcon />
          <p className="text-sm">Created at {user.metadata.lastSignInTime}</p>
        </div>
        <Separator />
        <div>
          <Button
            onClick={deleteUser}
            variant={"outline"}
            className="cursor-pointer text-red-400 hover:bg-red-50 hover:text-red-500 w-full"
            size="lg"
          >
            <TrashIcon /> Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useEffect, useState, type ChangeEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Edit } from "lucide-react";

export default function EmployeeAvatar({
  employee,
}: {
  employee: EmployeeWithId;
}) {
  const [mediaURL, setMediaURL] = useState<string>("");

  const { getMediaURL, uploadImage } = useFirebaseStorage();

  const fecthAvatar = async () => {
    const mediaURL = await getMediaURL(`gym/${employee.id}`);
    setMediaURL(mediaURL);
  };

  const handleUpdateCompanyAvatar = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !employee) return;
    await uploadImage(file, employee.id);
    await fecthAvatar();
  };

  useEffect(() => {
    fecthAvatar();
  }, []);

  return (
    <div className="w-fit relative">
      <Avatar className="w-28 h-28 shadow-md">
        <AvatarImage src={mediaURL} />
        <AvatarFallback className="text-xl">CN</AvatarFallback>
      </Avatar>
      <label
        htmlFor="avatarUpload"
        className="absolute -right-1 -bottom-1 bg-slate-700 rounded-full p-2 text-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
      >
        <Edit size={18} />
        <input
          id="avatarUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpdateCompanyAvatar}
        />
      </label>
    </div>
  );
}

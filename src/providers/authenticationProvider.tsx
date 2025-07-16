import { AuthenticationContext } from "@/contexts/AuthenticationContext";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import type { User } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";

export const AuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getAuthenticatedUser } = useFirebaseStorage();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchFunction = async () => {
      const authenticatedUser = await getAuthenticatedUser();
      setUser(authenticatedUser);
    };
    fetchFunction();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ user }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

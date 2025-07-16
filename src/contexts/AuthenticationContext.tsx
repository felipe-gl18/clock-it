import { createContext } from "react";
import type { User } from "firebase/auth";

type AuthenticationContextType = {
  user: User | null;
};

export const AuthenticationContext = createContext<AuthenticationContextType>({
  user: null,
});

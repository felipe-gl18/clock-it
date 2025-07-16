import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/");
    });

    return () => unsubscribe();
  }, [navigate]);

  return <div className="w-full h-full">{children}</div>;
}

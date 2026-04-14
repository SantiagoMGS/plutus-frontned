import { useEffect } from "react";
import { useFirebaseAuth } from "@/contexts/auth-context";
import { setTokenGetter } from "@/api/client";

export function useApiAuth() {
  const { firebaseUser, isAuthenticated } = useFirebaseAuth();

  useEffect(() => {
    if (isAuthenticated && firebaseUser) {
      setTokenGetter(() => firebaseUser.getIdToken());
    }
  }, [isAuthenticated, firebaseUser]);
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await authenticatedFetch("/api/users/user");

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    }

    checkLogin();
  }, [router]);

  if (isChecking || !isAuthenticated) {
    return <p>Checking your login...</p>;
  }

  return <>{children}</>;
}

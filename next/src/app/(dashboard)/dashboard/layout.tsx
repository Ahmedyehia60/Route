"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/api";
import DashboardSidebar from "./components/DashboardSidebar";
import styles from "./dashboard.module.css"

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
    return <div className={styles.loading}>Checking your login...</div>;
  }

  return (
    <div className={styles.appShell}>
      <DashboardSidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

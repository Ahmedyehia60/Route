"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, message } from "antd";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        messageApi.error(data.message || "Could not log out");
        return;
      }

      router.replace("/login");
    } catch {
      messageApi.error("Could not connect to the server");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main>
      {contextHolder}
      <h1>Dashboard</h1>

      <Button
        danger
        loading={isLoggingOut}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </main>
  );
}
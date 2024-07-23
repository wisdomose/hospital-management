"use client";
import { useUserStore } from "@/store/user";
import { ROLES } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    if (user.role !== ROLES["PATIENT"]) router.replace("/");
  }, [user]);

  return <>{children}</>;
}

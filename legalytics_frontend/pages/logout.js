// pages/logout.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { logout } from "@/auth/auth";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    logout().then(() => router.push("/login"));
  }, [router]);

  return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Logging out...</p>;
}
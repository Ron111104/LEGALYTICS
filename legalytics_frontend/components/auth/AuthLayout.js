// components/auth/AuthLayout.js
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-48 h-12 relative mb-2">
          {/* Replace with your logo */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LegalYtics</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">AI-Powered Legal Analytics Platform</p>
      </div>
      <Card className="w-full max-w-md shadow-xl border-gray-200 dark:border-gray-700">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{title}</h2>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
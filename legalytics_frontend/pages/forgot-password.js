// pages/forgot-password.js
import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage("Check your email for password reset instructions");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password">
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we&apos;ll send you instructions to reset your password.
      </p>
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600 text-sm text-center">{message}</p>
        </div>
      )}
      <form onSubmit={handleReset} className="space-y-5">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
          required
        />
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Send Reset Link"}
        </Button>
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
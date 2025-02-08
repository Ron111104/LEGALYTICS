import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/auth/firebaseConfig";
import { sendEmailVerification } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  // Function to refresh the user data and check if the email is verified
  const checkEmailVerified = async () => {
    const user = auth.currentUser;
    if (user) {
      // Reload user data to get the latest emailVerified status
      await user.reload();
      if (user.emailVerified) {
        router.push("/");
      } else {
        setMessage("Email is still not verified. Please check your inbox.");
      }
    }
  };

  // Run on mount to check if the user is verified
  useEffect(() => {
    checkEmailVerified();
  }, []);

  // Handle resend verification email
  const handleResendVerification = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage("Verification email sent. Check your inbox.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual refresh: reload user data and check verified status
  const handleRefresh = async () => {
    setLoading(true);
    setMessage(null);
    await checkEmailVerified();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold">Verify Your Email</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        A verification email has been sent to your email address. Please check your inbox and follow the instructions.
      </p>
      {message && <p className="text-blue-600 mt-3">{message}</p>}
      <div className="mt-4 flex space-x-4">
        <Button onClick={handleResendVerification} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Resend Verification Email"}
        </Button>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Refresh"}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Once verified, you will be redirected automatically.
      </p>
    </div>
  );
}

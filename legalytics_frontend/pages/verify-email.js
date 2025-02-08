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

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      router.push("/dashboard");
    }
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-semibold">Verify Your Email</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        A verification email has been sent to your email address. Please check your inbox and follow the instructions.
      </p>
      {message && <p className="text-blue-600 mt-3">{message}</p>}
      <Button onClick={handleResendVerification} disabled={loading} className="mt-4">
        {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Resend Verification Email"}
      </Button>
      <p className="mt-4 text-sm text-gray-500">
        Once verified, please <span className="text-blue-600 cursor-pointer" onClick={() => router.reload()}>refresh</span> this page.
      </p>
    </div>
  );
}
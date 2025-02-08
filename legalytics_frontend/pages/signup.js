import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signUp, signInWithGoogle, sendEmailVerification } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const user = await signUp(email, password);
      await sendEmailVerification(user); // Send verification email

      setMessage("Verification email sent. Please check your inbox.");
      setTimeout(() => {
        router.push("/verify-email"); // Redirect to verification page
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-600 text-sm text-center">{message}</p>
        </div>
      )}
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            required
          />
          <Input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>.
        </p>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Create Account"}
        </Button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or sign up with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={signInWithGoogle}
          className="w-full h-11"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

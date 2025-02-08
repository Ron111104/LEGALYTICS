import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, signInWithGoogle } from "@/auth/auth";
import { auth } from "@/auth/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        router.push("/"); // ✅ Redirect authenticated users
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signIn(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        router.push("/"); // ✅ Redirect only if email is verified
      } else {
        toast.error("Please verify your email before logging in.");
        await auth.signOut(); // Logout unverified users
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/"); // ✅ Allow Google login directly
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
            required
          />
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign In"}
        </Button>
        <div className="text-center mt-2">
          <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm">
            Forgot password?
          </Link>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or continue with</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-11"
          disabled={loading}
        >
          Sign in with Google
        </Button>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don&apos;t have an account?</span>{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

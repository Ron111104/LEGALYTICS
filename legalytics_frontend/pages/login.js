import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, signInWithGoogle } from "@/auth/auth";
import { auth } from "@/auth/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc"; 

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
        router.push("/");
      } else {
        toast.error("Please verify your email before logging in.");
        await auth.signOut();
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
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Darkened Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://t3.ftcdn.net/jpg/08/22/79/98/360_F_822799850_CJyuExXKNgznEMl8yNyROlisJybbOAnH.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="brightness-50" // Darkens the image
        />
      </div>

      {/* Login Form */}
      <div className="relative bg-black/70 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign In"}
          </Button>

          <div className="text-center mt-2">
            <Link href="/forgot-password" className="text-blue-400 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <Button
  type="button"
  variant="outline"
  onClick={handleGoogleSignIn}
  className="w-full h-11 flex items-center justify-center space-x-2 border-gray-600 hover:border-gray-400 text-white"
  disabled={loading}
>
  <FcGoogle size={24} /> {/* Google Icon */}
  <span>Sign in with Google</span>
</Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Don&apos;t have an account?</span>{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

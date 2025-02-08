import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success("Verification email sent. Check your inbox.");
      setTimeout(() => {
        router.push("/verify-email");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
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

      {/* Signup Form */}
      <div className="relative bg-black/70 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md text-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Create Your Account</h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
            <Input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-lg bg-gray-800 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Sign Up"}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            By signing up, you agree to our {" "}
            <Link href="/terms" className="text-blue-400 hover:underline">Terms</Link> and {" "}
            <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">or sign up with</span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={signInWithGoogle}
            className="w-full h-11 flex items-center justify-center space-x-2 border-gray-600 hover:border-gray-400 text-white"
            disabled={loading}
          >
            <FcGoogle size={24} />
            <span>Sign up with Google</span>
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account?</span> {" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

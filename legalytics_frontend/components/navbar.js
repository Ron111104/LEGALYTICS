import Link from "next/link";
import { useState, useEffect } from "react";
import { logout } from "@/auth/auth";
import { auth } from "@/auth/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Menu, X, UserCircle } from "lucide-react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Helper function to scroll to a section.
  // If not on the home page, it redirects to the home page with a query parameter.
  const scrollToSection = (sectionId) => {
    if (router.pathname !== "/") {
      router.push(`/?section=${sectionId}`).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg py-4 px-6 flex justify-between items-center">
      {/* Logo and Brand Name */}
      <Link href="/" className="flex items-center space-x-3">
        <img src="/logo.png" alt="Legalytics Logo" className="h-10 w-auto cursor-pointer" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <button onClick={() => scrollToSection("aboutus")} className="text-gray-700 hover:text-blue-900 transition">
          About Us
        </button>
        <button onClick={() => scrollToSection("features")} className="text-gray-700 hover:text-blue-900 transition">
          Features
        </button>
        <Link href="/case-retrieval" className="text-gray-700 hover:text-blue-900 transition">
          Case Retrieval
        </Link>
        <Link href="/bail-prediction" className="text-gray-700 hover:text-blue-900 transition">
          Bail Prediction
        </Link>
        <Link href="/case-summarization" className="text-gray-700 hover:text-blue-900 transition">
          Case Summarization
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-900 transition">
          Contact
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center text-gray-700 hover:text-blue-900 transition focus:outline-none"
          >
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full border-2 border-gray-300" />
            ) : (
              <UserCircle className="h-8 w-8 text-gray-500" />
            )}
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-md overflow-hidden">
              {user ? (
                <>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Log In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-3 md:hidden transition-all ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <button onClick={() => scrollToSection("aboutus")} className="text-gray-700 hover:text-blue-900 transition">
          About Us
        </button>
        <button onClick={() => scrollToSection("features")} className="text-gray-700 hover:text-blue-900 transition">
          Features
        </button>
        <Link href="/case-retrieval" className="text-gray-700 hover:text-blue-900 transition">
          Case Retrieval
        </Link>
        <Link href="/bail-prediction" className="text-gray-700 hover:text-blue-900 transition">
          Bail Prediction
        </Link>
        <Link href="/case-summarization" className="text-gray-700 hover:text-blue-900 transition">
          Case Summarization
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-900 transition">
          Contact
        </Link>
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="text-gray-700 hover:text-blue-900 transition flex items-center space-x-2"
        >
          {user && user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-6 w-6 rounded-full border-2 border-gray-300" />
          ) : (
            <UserCircle className="h-6 w-6 text-gray-500" />
          )}
          <span>{user ? "Profile" : "Log In"}</span>
        </button>
        {profileOpen && (
          <div className="w-full bg-white shadow-md rounded-md flex flex-col text-center">
            {user ? (
              <>
                <Link href="/profile" className="py-2 text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>
                <button onClick={handleLogout} className="py-2 text-gray-700 hover:bg-gray-100">
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="py-2 text-gray-700 hover:bg-gray-100">
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

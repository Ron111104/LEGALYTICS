import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth } from "@/auth/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-blue-900 text-white text-center py-24 px-6">
        <h1 className="text-5xl font-bold">Legal Analytics Redefined</h1>
        <p className="mt-4 text-lg">AI-driven legal insights for professionals</p>
        {user ? (
          <Link href="/dashboard">
            <Button className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/signup">
            <Button className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              Get Started
            </Button>
          </Link>
        )}
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-900">Empowering Legal Professionals</h2>
        <p className="mt-4 text-gray-600">Harness AI to make informed legal decisions faster.</p>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all">
              <div className="w-full h-40 relative">
                <Image src={feature.image} alt={feature.title} layout="fill" objectFit="cover" className="rounded-lg" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mt-4">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100 text-center px-6">
        <h2 className="text-3xl font-semibold text-gray-900">How Legalytics Works</h2>
        <p className="mt-4 text-gray-600">Our AI-driven platform streamlines legal research and assistance:</p>
        <div className="grid md:grid-cols-2 gap-10 mt-10 max-w-6xl mx-auto">
          {howItWorks.map((item, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md text-left">
              <h3 className="text-xl font-semibold text-blue-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-16 text-center">
        <h2 className="text-3xl font-semibold">Join the Future of Legal AI</h2>
        <p className="mt-4">{user ? "Explore the latest AI-powered legal tools in your dashboard." : "Sign up today to experience cutting-edge legal analytics."}</p>
        {user ? (
          <Link href="/dashboard">
            <Button className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link href="/signup">
            <Button className="mt-6 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              Sign Up Now
            </Button>
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} Legalytics. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Case Retrieval",
    description: "Instantly access relevant past legal cases to streamline legal research.",
    image: "https://i.pinimg.com/736x/0a/83/77/0a83778cf3e799e69cad19b55c2a2954.jpg",
  },
  {
    title: "Bail Prediction",
    description: "AI-driven analysis predicts the likelihood of bail being granted.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStdBfSAwjzUsKYHEBd8uxNAA5UV55KkSB9Vw&s",
  },
  {
    title: "Case Summarization",
    description: "Automatically generates concise summaries of lengthy legal documents.",
    image: "https://www.shutterstock.com/image-photo/case-study-education-concept-analysis-600nw-2464043175.jpg",
  },
];


const howItWorks = [
  {
    title: "Legal Named Entity Recognition",
    description: "Our AI extracts important legal entities such as judges, appellants, respondents, and case citations, ensuring structured and meaningful insights.",
  },
  {
    title: "Multilingual Legal Document Processing",
    description: "Legalytics supports translation and summarization of legal documents across multiple languages, bridging the gap for diverse legal professionals and clients.",
  },
];
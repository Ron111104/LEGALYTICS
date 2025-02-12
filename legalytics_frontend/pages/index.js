// pages/index.js
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { auth } from "@/auth/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Chatbot from "@/components/chatbot";  // Import the chatbot

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
        <motion.h1
          className="text-5xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
        >
          Legal Analytics Redefined
        </motion.h1>
        <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeInOut", duration: 0.8 }}
        >
          AI-driven legal insights for professionals
        </motion.p>
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
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          Empowering Legal Professionals
        </motion.h2>
        <motion.p
          className="mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
        >
          Harness AI to make informed legal decisions faster.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-full h-40 relative">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mt-4">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="aboutus" className="py-20 bg-blue-800 text-center px-6">
        <motion.h2
          className="text-3xl font-semibold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          How Legalytics Works
        </motion.h2>
        <motion.p
          className="mt-4 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
        >
          Our AI-driven platform streamlines legal research and assistance:
        </motion.p>
        <div className="grid md:grid-cols-2 gap-10 mt-10 max-w-6xl mx-auto">
          {howItWorks.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: "easeInOut", duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-full h-40 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-blue-700 mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gray-100 text-center px-6">
        <motion.h2
          className="text-3xl font-semibold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          About Legalytics
        </motion.h2>
        <motion.p
          className="mt-4 text-gray-600 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
        >
          Legalytics is an AI-powered platform designed to bridge the gap between law and technology. Our mission is to streamline legal research, improve case analysis, and enhance legal decision-making through AI-driven insights. By combining cutting-edge NLP models with legal expertise, we empower both professionals and consumers with smarter, faster, and more reliable legal assistance.
        </motion.p>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-16 text-center">
        <motion.h2
          className="text-3xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          Join the Future of Legal AI
        </motion.h2>
        <motion.p
          className="mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
        >
          {user
            ? "Explore the latest AI-powered legal tools in your dashboard."
            : "Sign up today to experience cutting-edge legal analytics."}
        </motion.p>
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
      <Chatbot />
      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} Legalytics. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

const howItWorks = [
  {
    title: "Legal Named Entity Recognition",
    description:
      "Our AI extracts important legal entities such as judges, appellants, respondents, and case citations, ensuring structured and meaningful insights.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX7HlCxOY-gjM4hafH1xaPJwPEO-4Yy9zFzw&s",
  },
  {
    title: "Multilingual Legal Document Processing",
    description:
      "Legalytics supports translation and summarization of legal documents across multiple languages, bridging the gap for diverse legal professionals and clients.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS35_MQc5tDQmP7ka1Uj66barG7qXmsShnkqw&s",
  },
];

const features = [
  {
    title: "Case Retrieval",
    description: "Instantly access relevant past legal cases to streamline legal research.",
    image:
      "https://i.pinimg.com/736x/0a/83/77/0a83778cf3e799e69cad19b55c2a2954.jpg",
  },
  {
    title: "Bail Prediction",
    description: "AI-driven analysis predicts the likelihood of bail being granted.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStdBfSAwjzUsKYHEBd8uxNAA5UV55KkSB9Vw&s",
  },
  {
    title: "Case Summarization",
    description: "Automatically generates concise summaries of lengthy legal documents.",
    image:
      "https://www.shutterstock.com/image-photo/case-study-education-concept-analysis-600nw-2464043175.jpg",
  },
];

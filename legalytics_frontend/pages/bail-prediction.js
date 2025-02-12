// pages/bail-prediction.js
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

export default function BailPrediction() {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    // When prediction updates, scroll the result into view (for smaller screens)
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prediction]);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      alert("Please enter the case description text.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DEV}/api/bail-prediction`,
        { text: inputText },
        { headers: { "Content-Type": "application/json" } }
      );
      setPrediction(response.data.bail_decision);
    } catch (error) {
      console.error("Error predicting bail:", error);
      setPrediction("Error predicting bail.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="px-4 py-8 md:py-12 lg:py-16 max-w-6xl w-full mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeInOut", duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6"
        >
          ⚖️ Bail Prediction
        </motion.h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 px-4">
          Enter the case description below to predict the bail decision.
        </p>

        {/* Responsive container: stack vertically on small screens, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Input Form */}
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Case Description:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the case details here..."
              ></textarea>
            </div>
            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-lg py-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Predict Bail Decision"}
            </Button>
            {loading && (
              <p className="text-center text-blue-500 text-lg mt-4">Processing...</p>
            )}
          </div>

          {/* Right Column: Prediction Result */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center">
            {prediction ? (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
                className="w-full"
              >
                <Card className="bg-gray-200 dark:bg-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      Bail Decision:
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                      {prediction}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="w-full text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg">Your prediction will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

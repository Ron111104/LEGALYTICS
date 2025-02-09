import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X } from "lucide-react";
import axios from "axios";
import Image from "next/image";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to Legalytics AI Chatbot. I can help you with questions about legal cases, precedents, bail decisions, and legal document summarization.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post("/api/chatbot", { message: input });
      const chatResponse = response.data.response || "I'm sorry, I didn't understand that.";
      setMessages([...updatedMessages, { role: "assistant", content: chatResponse }]);
    } catch (err) {
      console.error("Error fetching chat response:", err);
      setError("An error occurred. Please try again.");
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I encountered an error processing your request. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
  className="fixed bottom-6 right-6 z-50 bg-white p-1 rounded-full shadow-lg cursor-pointer"
  onClick={() => setIsOpen(!isOpen)}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  aria-label="Toggle chat"
>
  <Image
    src="/chatbot.jpg" // Image in public folder
    alt="Chatbot"
    width={50}  // Adjust width as needed
    height={50} // Adjust height as needed
    className="rounded-full"
  />
</motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-[calc(100vw-32px)] sm:w-[400px] md:w-[480px] bg-white border border-gray-300 rounded-xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ opacity: 0, y: 50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "480px" }}
            exit={{ opacity: 0, y: 50, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex justify-between items-center bg-blue-800 text-white px-4 py-3">
              <h3 className="font-semibold text-lg">
                Legalytics AI Chatbot
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-red-300"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={chatHistoryRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50"
            >
              {error && (
                <div className="mb-2 p-2 bg-red-100 border border-red-300 text-red-700 rounded">
                  {error}
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl break-words shadow ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none border border-gray-300"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-100 border-t border-gray-300">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ask about legal cases..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={loading}
                  aria-label="Chat input"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="ml-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  {loading ? "..." : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
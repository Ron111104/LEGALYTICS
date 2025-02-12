// pages/case-retrieval.js
import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Loader2, FileText, Trash2, Download } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

export default function CaseRetrieval() {
  // State for toggling between input methods: "pdf" or "text"
  const [inputType, setInputType] = useState("pdf");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // For toggling the download dropdown on a result card (by index)
  const [downloadDropdown, setDownloadDropdown] = useState(null);
  const messagesEndRef = useRef(null);

  // Setup dropzone (only used when inputType is "pdf")
  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  // Toggle input method and clear previous input
  const handleToggleInput = (type) => {
    setInputType(type);
    setFile(null);
    setText("");
    setResults([]); // Clear search results when toggling input mode
  };

  // Delete the selected file and clear search results
  const handleDeleteFile = () => {
    setFile(null);
    setResults([]);
  };

  // Send form data to the backend.
  // The backend checks whether a PDF file was provided and extracts text if so.
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (inputType === "pdf" && file) {
      formData.append("file", file);
    }
    // Always append text, even if empty
    formData.append("text", text);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DEV}/api/search`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // Expecting an array of case objects in response.data.retrieved_cases
      setResults(response.data.retrieved_cases);
    } catch (error) {
      console.error("Error during search:", error);
    }
    setLoading(false);
  };

  // Handle download of full text in a specified format.
  // Formats supported: "txt", "pdf", "docx"
  const handleDownload = (fullText, format) => {
    let mimeType;
    let extension;
    if (format === "txt") {
      mimeType = "text/plain";
      extension = "txt";
    } else if (format === "pdf") {
      mimeType = "application/pdf";
      extension = "pdf";
    } else if (format === "docx") {
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      extension = "docx";
    } else {
      mimeType = "text/plain";
      extension = "txt";
    }
    const blob = new Blob([fullText], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `case_full_text.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadDropdown(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="p-8 space-y-6 w-1/2 mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200"
        >
          🔍 Case Retrieval
        </motion.h1>

        {/* Toggle for input method */}
        <div className="flex justify-center space-x-4">
          <Button variant={inputType === "pdf" ? "default" : "outline"} onClick={() => handleToggleInput("pdf")}>
            Upload PDF
          </Button>
          <Button variant={inputType === "text" ? "default" : "outline"} onClick={() => handleToggleInput("text")}>
            Enter Text
          </Button>
        </div>

        {/* Conditional rendering based on inputType */}
        {inputType === "pdf" && (
          <motion.div
            {...getRootProps()}
            className="border-2 border-dashed p-8 rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-md flex flex-col items-center"
          >
            <input {...getInputProps()} />
            <UploadCloud className="text-gray-500 dark:text-gray-300 w-14 h-14 mb-2" />
            <p className="text-gray-500 dark:text-gray-300 font-medium">
              Drag & Drop or Click to Upload a PDF
            </p>
          </motion.div>
        )}

        {inputType === "pdf" && file && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Uploaded File:
            </h3>
            <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mt-2">
              <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
              <Trash2 className="text-red-500 cursor-pointer" onClick={handleDeleteFile} />
            </div>
          </div>
        )}

        {inputType === "text" && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Enter Text:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              rows="8"
              placeholder="Enter search text here..."
            ></textarea>
          </div>
        )}

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="w-full flex items-center gap-2 text-lg py-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          Search Cases
        </Button>

        {loading && (
          <p className="text-center text-blue-500 text-lg">Processing...</p>
        )}

        {/* Display search results */}
        {results && results.length > 0 && (
          <div className="space-y-4 mt-6">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gray-200 dark:bg-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                      <FileText className="mr-2" /> {result["Case ID"]}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Similarity: {result["Similarity Score"]}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Preview: {result["Text Preview"]}
                    </p>
                    <div className="relative inline-block">
                      <Button onClick={() => setDownloadDropdown(downloadDropdown === index ? null : index)}>
                        <Download className="mr-1" /> Download Full Text
                      </Button>
                      {downloadDropdown === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleDownload(result["Full Text"], "txt")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            as .txt
                          </button>
                          <button
                            onClick={() => handleDownload(result["Full Text"], "pdf")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            as .pdf
                          </button>
                          <button
                            onClick={() => handleDownload(result["Full Text"], "docx")}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            as .docx
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

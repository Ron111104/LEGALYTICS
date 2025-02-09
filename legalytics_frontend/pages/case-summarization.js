import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, Loader2, FileText, Trash2, Download } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

export default function CaseSummarization() {
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [downloadOptions, setDownloadOptions] = useState(null);
  const messagesEndRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => {
        const uniqueFiles = acceptedFiles.filter(
          (file) => !prevFiles.some((prev) => prev.name === file.name)
        );
        return [...prevFiles, ...uniqueFiles];
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setLoading(true);
    setUploadProgress({});

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DEV}/api/summarize`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            }));
          },
        });

        setMessages((prev) => [
          ...prev,
          { type: "file", name: file.name },
          { type: "summary", text: response.data.summary },
        ]);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    setFiles([]);
    setLoading(false);
  };

  const handleDownload = (text, format) => {
    const blob = new Blob([text], { type: format === "txt" ? "text/plain" : format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `case_summary.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="p-8 space-y-6 max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
          📜 Case Summarization
        </motion.h1>
        <motion.div {...getRootProps()} className="border-2 border-dashed p-8 rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-md flex flex-col items-center">
          <input {...getInputProps()} />
          <UploadCloud className="text-gray-500 dark:text-gray-300 w-14 h-14 mb-2" />
          <p className="text-gray-500 dark:text-gray-300 font-medium">Drag & Drop or Click to Upload PDFs</p>
        </motion.div>

        {files.length > 0 && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Uploaded Files:</h3>
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg mt-2">
                <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                <Trash2 className="text-red-500 cursor-pointer" onClick={() => handleDeleteFile(index)} />
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleUpload} disabled={files.length === 0 || loading} className="w-full flex items-center gap-2 text-lg py-3">
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />} Upload & Summarize
        </Button>
        {loading && <p className="text-center text-blue-500 text-lg">Processing... {Object.values(uploadProgress).join("% , ")}%</p>}

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: msg.type === "summary" ? 50 : -50 }} animate={{ opacity: 1, x: 0 }}>
              <Card className={`relative ${msg.type === "summary" ? "bg-blue-100 dark:bg-blue-800 self-end" : "bg-gray-200 dark:bg-gray-700 self-start"} shadow-lg`}>
                <CardContent className="p-6">
                  {msg.type === "file" ? (
                    <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center"><FileText className="mr-2" /> {msg.name}</p>
                  ) : (
                    <div>
                      <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                        <FileText className="mr-2" /> Summary
                      </h2>
                      <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{msg.text}</p>
                      <div className="mt-4 flex items-center gap-2 relative">
                        <Button onClick={() => setDownloadOptions(downloadOptions === index ? null : index)}>
                          <Download /> Download
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

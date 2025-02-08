import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, FileText, Loader2, Download } from "lucide-react";
import axios from "axios";

export default function CaseSummarization() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => setFile(acceptedFiles[0]),
  });

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "case_summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Case Summarization</h1>
      <p className="text-center text-gray-600 dark:text-gray-400">Upload a legal case PDF and get a concise summary.</p>
      
      <div {...getRootProps()} className="border-2 border-dashed p-6 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800">
        <input {...getInputProps()} />
        <p className="text-center text-gray-500 dark:text-gray-300">Drag & Drop or Click to Upload a PDF</p>
        {file && <p className="text-center mt-2 font-semibold text-gray-700 dark:text-gray-300">{file.name}</p>}
      </div>
      
      <Button onClick={handleUpload} disabled={!file || loading} className="w-full flex items-center justify-center gap-2">
        {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />} Upload & Summarize
      </Button>
      
      {loading && <p className="text-center text-blue-500">Processing... {uploadProgress}%</p>}
      
      {summary && (
        <Card className="p-6 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
              <FileText className="mr-2" /> Summary
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
            <Button onClick={handleDownload} className="mt-4 flex items-center gap-2">
              <Download /> Download Summary
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { FileText, FileDown, Download } from "lucide-react";
import { Button } from "./ui/button";

interface DownloadButtonsProps {
  onDownload: (format: "pdf" | "docx" | "txt") => void;
  isLoading?: boolean;
}

function DownloadButtons({ onDownload, isLoading = false }: DownloadButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      <Button
        onClick={() => onDownload("pdf")}
        disabled={isLoading}
        className="bg-red-600 hover:bg-red-700 rounded-xl shadow-md px-6"
      >
        <FileText className="w-4 h-4 mr-2" />
        Download PDF
      </Button>
      <Button
        onClick={() => onDownload("docx")}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md px-6"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Download DOCX
      </Button>
      <Button
        onClick={() => onDownload("txt")}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 rounded-xl shadow-md px-6"
      >
        <Download className="w-4 h-4 mr-2" />
        Download TXT
      </Button>
    </div>
  );
}

export default DownloadButtons;

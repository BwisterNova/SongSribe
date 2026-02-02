import { FileText, FileDown, Download, Lock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DownloadButtonsProps {
  onDownload: (format: "pdf" | "docx" | "txt") => void;
  isLoading?: boolean;
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

function DownloadButtons({ onDownload, isLoading = false, isPremium = false, onUpgradeClick }: DownloadButtonsProps) {
  const handlePremiumFormat = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onDownload("pdf")}
                disabled={isLoading || !isPremium}
                className={`rounded-xl shadow-md px-6 ${
                  isPremium
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-600/50 cursor-not-allowed"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download PDF
                {!isPremium && <Lock className="w-3 h-3 ml-2" />}
              </Button>
            </TooltipTrigger>
            {!isPremium && (
              <TooltipContent>
                <p>PDF download available in Pro plan</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onDownload("docx")}
                disabled={isLoading || !isPremium}
                className={`rounded-xl shadow-md px-6 ${
                  isPremium
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600/50 cursor-not-allowed"
                }`}
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download DOCX
                {!isPremium && <Lock className="w-3 h-3 ml-2" />}
              </Button>
            </TooltipTrigger>
            {!isPremium && (
              <TooltipContent>
                <p>DOCX download available in Pro plan</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={() => onDownload("txt")}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 rounded-xl shadow-md px-6"
        >
          <Download className="w-4 h-4 mr-2" />
          Download TXT
        </Button>
      </div>
    </TooltipProvider>
  );
}

export default DownloadButtons;

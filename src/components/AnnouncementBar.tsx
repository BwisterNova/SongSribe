import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 flex items-center justify-center relative z-50">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
        <p className="font-medium">
          This project is still under development. Some features may not work as expected.
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 md:right-4 hover:bg-white/20 text-white h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default AnnouncementBar;

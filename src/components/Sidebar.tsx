import { useState } from "react";
import { Music, History, FileText, Chrome, Sun, Moon, User, MessageCircle, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (page: "home" | "lyrics-history" | "note-history") => void;
  currentPage?: "home" | "lyrics-history" | "note-history";
}

function Sidebar({ isCollapsed, onToggle, isMobile = false, isOpen = false, onClose, onNavigate, currentPage = "home" }: SidebarProps) {
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleExtensionClick = () => {
    setShowExtensionDialog(true);
  };

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="p-4 border-b border-purple-500/20">
        <button
          onClick={isMobile ? onClose : onToggle}
          className="flex items-center gap-3 w-full hover:bg-purple-500/10 rounded-xl p-2 transition-all"
        >
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl flex-shrink-0">
            <Music className="w-6 h-6 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              SongScribe
            </span>
          )}
        </button>
      </div>

      {/* Primary Items */}
      <div className="flex-1 p-4 space-y-2">
        <Button
          variant="ghost"
          onClick={() => {
            onNavigate?.("lyrics-history");
            if (isMobile) onClose?.();
          }}
          className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
            currentPage === "lyrics-history" ? "bg-purple-500/10 text-purple-400" : ""
          } ${isCollapsed && !isMobile ? "px-2" : ""}`}
        >
          <History className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Lyrics History</span>}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            onNavigate?.("note-history");
            if (isMobile) onClose?.();
          }}
          className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
            currentPage === "note-history" ? "bg-purple-500/10 text-purple-400" : ""
          } ${isCollapsed && !isMobile ? "px-2" : ""}`}
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isMobile) && <span>Note History</span>}
        </Button>

        {/* Mobile-only primary items */}
        {isMobile && (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400"
            >
              <DollarSign className="w-5 h-5 flex-shrink-0 text-white" />
              <span>Pricing</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400"
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0 text-white" />
              <span>Support</span>
            </Button>
          </>
        )}
      </div>

      {/* Bottom Items */}
      <div className="p-4 space-y-2 border-t border-purple-500/20">
        {/* Desktop only */}
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              onClick={() => window.open("https://discord.gg/songscribe", "_blank")}
              className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
                isCollapsed && !isMobile ? "px-2" : ""
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              {(!isCollapsed || isMobile) && <span>Join Discord</span>}
            </Button>
          </>
        )}

        {/* Both desktop and mobile */}
        <Button
          variant="ghost"
          onClick={handleExtensionClick}
          className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
            isCollapsed && !isMobile ? "px-2" : ""
          }`}
        >
          <Chrome className="w-5 h-5 flex-shrink-0 text-white" />
          {(!isCollapsed || isMobile) && <span>Chrome Extension</span>}
        </Button>

        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
            isCollapsed && !isMobile ? "px-2" : ""
          }`}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 flex-shrink-0 text-white" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0 text-white" />
          )}
          {(!isCollapsed || isMobile) && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 hover:bg-purple-500/10 hover:text-purple-400 ${
            isCollapsed && !isMobile ? "px-2" : ""
          }`}
        >
          <User className="w-5 h-5 flex-shrink-0 text-white" />
          {(!isCollapsed || isMobile) && <span>My Account</span>}
        </Button>
      </div>

      {/* Extension Dialog */}
      <Dialog open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chrome Extension
            </DialogTitle>
            <DialogDescription>
              Get lyrics for any song directly from your browser
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80"
              alt="Chrome Extension"
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Coming Soon! 🚀</p>
              <p className="text-muted-foreground text-sm">
                We're working hard to bring you the SongScribe Chrome extension. Stay tuned!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Mobile sidebar (drawer)
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-purple-500/20 z-50 transform transition-transform duration-300 lg:hidden ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">{sidebarContent}</div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-background border-r border-purple-500/20 z-40 transition-all duration-300 hidden lg:flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {sidebarContent}
    </aside>
  );
}

export default Sidebar;
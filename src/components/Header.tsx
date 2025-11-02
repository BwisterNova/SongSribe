import { Music, User } from "lucide-react";
import { Button } from "./ui/button";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl">
            <Music className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            SongScribe
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            Pricing
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            Support
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            Bulk
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            API
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-purple-400">
            <User className="w-4 h-4" />
            My Account
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

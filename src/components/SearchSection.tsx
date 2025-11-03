import { useState } from "react";
import { Search, Music2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchSectionProps {
  onSearch: (url: string) => void;
  onMicClick: () => void;
  isLoading?: boolean;
}

function SearchSection({ onSearch, onMicClick, isLoading = false }: SearchSectionProps) {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const validateURL = (input: string): boolean => {
    // Check if it looks like a URL (contains http/https or common domain patterns)
    const urlPattern = /^(https?:\/\/)?(www\.)?(spotify\.com|youtube\.com|youtu\.be|audiomack\.com|music\.apple\.com|soundcloud\.com|boomplay\.com|deezer\.com)\/.+/i;
    const hasProtocol = /^https?:\/\//i.test(input);
    const hasDomain = /\.(com|net|org|io)/i.test(input);
    
    return urlPattern.test(input) || (hasProtocol && hasDomain);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      if (validateURL(url.trim())) {
        setUrlError("");
        onSearch(url.trim());
      } else {
        setUrlError("Invalid URL");
      }
    }
  };

  const handleSearchClick = () => {
    if (url.trim()) {
      if (validateURL(url.trim())) {
        setUrlError("");
        onSearch(url.trim());
      } else {
        setUrlError("Invalid URL");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // Show error only if user has typed something that doesn't look like a URL
    if (value.trim() && !value.includes(".") && !value.includes("/") && value.length > 3) {
      setUrlError("Invalid URL");
    } else {
      setUrlError("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* Subtitle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Music2 className="w-5 h-5 text-purple-400" />
        <p className="text-muted-foreground text-sm">
          Search by URL or use microphone to identify songs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Paste song URL (Spotify, YouTube, Apple Music, SoundCloud, Boomplay, Deezer, Audiomack)..."
            value={url}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`pl-6 pr-14 py-6 text-lg bg-card/50 backdrop-blur-sm border-2 ${
              urlError ? "border-red-500" : "border-purple-500/20 focus:border-purple-500/50"
            } rounded-2xl shadow-lg`}
          />
          <Button
            type="button"
            onClick={handleSearchClick}
            disabled={isLoading || !url.trim()}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg h-10 w-10"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
        {urlError && (
          <p className="text-red-500 text-sm mt-2 ml-2">{urlError}</p>
        )}
      </form>
      
      <div className="flex justify-center mt-6">
        <Button
          type="button"
          onClick={onMicClick}
          disabled={isLoading}
          variant="ghost"
          className="group relative px-8 py-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 hover:from-purple-600/20 hover:to-blue-600/20 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-2xl shadow-lg transition-all duration-300"
        >
          <span className="text-lg font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Listen via 🎙️
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 rounded-2xl transition-all duration-300" />
        </Button>
      </div>
    </div>
  );
}

export default SearchSection;
import { Card, CardContent, CardHeader } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { X, Mic } from "lucide-react";
import { Button } from "./ui/button";
import DownloadButtons from "./DownloadButtons";

interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  lyrics: string;
  noLyrics?: boolean;
  source?: string;
  platform?: string;
  message?: string;
}

interface ResultsCardProps {
  songData?: SongData;
  isLoading?: boolean;
  onDownload: (format: "pdf" | "docx" | "txt") => void;
  onClose: () => void;
}

function ResultsCard({ songData, isLoading = false, onDownload, onClose }: ResultsCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-3xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex gap-6">
            <Skeleton className="w-32 h-32 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!songData) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden relative">
      <Button
        onClick={onClose}
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 rounded-full"
      >
        <X className="w-5 h-5" />
      </Button>

      <CardHeader className="pb-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="flex gap-6 items-start">
          <img
            src={songData.albumArt}
            alt={`${songData.title} album art`}
            className="w-32 h-32 rounded-2xl shadow-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{songData.title}</h2>
            <p className="text-xl text-purple-300">{songData.artist}</p>
            {songData.platform && (
              <p className="text-sm text-purple-400/70 mt-2">Platform: {songData.platform}</p>
            )}
            {songData.source && songData.lyrics && (
              <p className="text-xs text-purple-400/60 mt-1">
                Lyrics from: {songData.source === 'audd' ? 'AudD' : songData.source === 'platform_metadata' ? 'Platform Metadata' : songData.source}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">Lyrics</h3>
          <ScrollArea className="h-96 rounded-xl bg-black/20 p-6 border border-purple-500/10">
            {songData.noLyrics || !songData.lyrics ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Mic className="w-16 h-16 text-purple-400/50" />
                <p className="text-gray-400 text-lg">
                  {songData.message || "Lyrics not available for this song."}
                </p>
              </div>
            ) : (
              <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-gray-200">
                {songData.lyrics}
              </pre>
            )}
          </ScrollArea>
        </div>
        {!songData.noLyrics && songData.lyrics && (
          <DownloadButtons onDownload={onDownload} />
        )}
      </CardContent>
    </Card>
  );
}

export default ResultsCard;
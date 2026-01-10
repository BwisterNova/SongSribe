import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2, Eye, Share2, Music, ArrowLeft, LogIn, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LyricHistoryItem {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  lyrics: string;
  savedAt: Date;
}

interface LyricsHistoryPageProps {
  onBack: () => void;
  lyricsHistory?: LyricHistoryItem[];
  onDeleteLyric?: (id: string) => void;
  onViewLyric?: (item: LyricHistoryItem) => void;
}

function LyricsHistoryPage({
  onBack,
  lyricsHistory = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
      lyrics: "I've been tryna call...",
      savedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Shape of You",
      artist: "Ed Sheeran",
      albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&q=80",
      lyrics: "The club isn't the best place...",
      savedAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
      lyrics: "Is this the real life...",
      savedAt: new Date("2024-01-13"),
    },
  ],
  onDeleteLyric,
  onViewLyric,
}: LyricsHistoryPageProps) {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LyricHistoryItem | null>(null);

  const handleDelete = (item: LyricHistoryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem && onDeleteLyric) {
      onDeleteLyric(selectedItem.id);
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleView = (item: LyricHistoryItem) => {
    if (onViewLyric) {
      onViewLyric(item);
    }
  };

  const handleShare = (item: LyricHistoryItem) => {
    if (navigator.share) {
      navigator.share({
        title: `${item.title} - ${item.artist}`,
        text: `Check out the lyrics for ${item.title} by ${item.artist}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-purple-500/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Lyrics History
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your saved lyrics collection
            </p>
          </div>
        </div>

        {/* Sign In Required */}
        {!user ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Sign In Required
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Please sign in to view and manage your saved lyrics collection
            </p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Sign In
            </Button>
          </div>
        ) : lyricsHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music className="w-16 h-16 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No lyrics saved yet
            </h3>
            <p className="text-muted-foreground">
              Search for songs and save their lyrics to see them here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lyricsHistory.map((item) => (
                <Card
                  key={item.id}
                  className="bg-card/50 dark:bg-card/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={item.albumArt}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Action Menu */}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-black/40 hover:bg-black/60 rounded-full w-8 h-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleView(item)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Lyrics
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(item)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                    <p className="text-sm text-purple-400 dark:text-purple-300 truncate">{item.artist}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Saved {item.savedAt.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lyrics</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.title}" by {selectedItem?.artist}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default LyricsHistoryPage;

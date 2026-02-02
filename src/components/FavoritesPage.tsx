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
import { MoreVertical, Trash2, Eye, Share2, Heart, ArrowLeft, Music, Lock, LogIn, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FavoriteItem {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  lyrics?: string;
  savedAt: Date;
}

interface FavoritesPageProps {
  onBack: () => void;
  onNavigateToAccount: () => void;
  onNavigateToPricing: () => void;
  favorites?: FavoriteItem[];
  onRemoveFavorite?: (id: string) => void;
  onViewFavorite?: (item: FavoriteItem) => void;
  isPremium?: boolean;
}

function FavoritesPage({
  onBack,
  onNavigateToAccount,
  onNavigateToPricing,
  favorites = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
      lyrics: "I've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm going through withdrawals",
      savedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Shape of You",
      artist: "Ed Sheeran",
      albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&q=80",
      lyrics: "The club isn't the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots",
      savedAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&q=80",
      lyrics: "Is this the real life?\nIs this just fantasy?\nCaught in a landslide\nNo escape from reality",
      savedAt: new Date("2024-01-13"),
    },
    {
      id: "4",
      title: "Hotel California",
      artist: "Eagles",
      albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80",
      lyrics: "On a dark desert highway\nCool wind in my hair\nWarm smell of colitas\nRising up through the air",
      savedAt: new Date("2024-01-12"),
    },
    {
      id: "5",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200&q=80",
      lyrics: "She's got a smile it seems to me\nReminds me of childhood memories\nWhere everything was as fresh as the bright blue sky",
      savedAt: new Date("2024-01-11"),
    },
  ],
  onRemoveFavorite,
  onViewFavorite,
  isPremium = false,
}: FavoritesPageProps) {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<FavoriteItem | null>(null);
  
  const FREE_LIMIT = 5;

  const handleRemove = (item: FavoriteItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmRemove = () => {
    if (selectedItem && onRemoveFavorite) {
      onRemoveFavorite(selectedItem.id);
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleView = (item: FavoriteItem, index: number) => {
    if (!isPremium && index >= FREE_LIMIT) {
      return;
    }
    setViewingItem(item);
    setViewDialogOpen(true);
    if (onViewFavorite) {
      onViewFavorite(item);
    }
  };

  const handleShare = (item: FavoriteItem) => {
    if (navigator.share) {
      navigator.share({
        title: `${item.title} - ${item.artist}`,
        text: `Check out ${item.title} by ${item.artist} on SongScribe!`,
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
              Favorites
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your favorite songs collection
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
              Please sign in to view and manage your favorite songs
            </p>
            <Button
              onClick={onNavigateToAccount}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Sign In
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-16 h-16 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No favorites yet
            </h3>
            <p className="text-muted-foreground">
              Start adding songs to your favorites to see them here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((item, index) => {
                const isLocked = !isPremium && index >= FREE_LIMIT;
                
                return (
                  <Card
                    key={item.id}
                    onClick={() => !isLocked && handleView(item, index)}
                    className={`bg-card/50 dark:bg-card/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer relative ${isLocked ? "opacity-60" : ""}`}
                  >
                    <div className="relative">
                      <img
                        src={item.albumArt}
                        alt={item.title}
                        className={`w-full h-40 object-cover ${isLocked ? "blur-sm" : ""}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      {/* Lock Overlay for Premium */}
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                          <Crown className="w-8 h-8 text-yellow-500 mb-2" />
                          <span className="text-white text-sm font-medium">Premium Only</span>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToPricing();
                            }}
                            className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs"
                          >
                            Upgrade
                          </Button>
                        </div>
                      )}
                      
                      {/* Heart Icon */}
                      {!isLocked && (
                        <div className="absolute top-2 left-2">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </div>
                        </div>
                      )}
                      
                      {/* Action Menu */}
                      {!isLocked && (
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/40 hover:bg-black/60 rounded-full w-8 h-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleView(item, index);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Lyrics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleShare(item);
                              }}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemove(item);
                                }}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className={`font-semibold text-foreground truncate ${isLocked ? "blur-sm" : ""}`}>{item.title}</h3>
                      <p className={`text-sm text-purple-400 dark:text-purple-300 truncate ${isLocked ? "blur-sm" : ""}`}>{item.artist}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {item.savedAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Premium Upsell Banner */}
            {!isPremium && favorites.length > FREE_LIMIT && (
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-500/20 text-center">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1">Unlock All Your Favorites</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Premium to access your full favorites collection
                </p>
                <Button
                  onClick={onNavigateToPricing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </ScrollArea>
        )}
        
        {/* View Lyrics Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                {viewingItem && (
                  <>
                    <img
                      src={viewingItem.albumArt}
                      alt={viewingItem.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{viewingItem.title}</h2>
                      <p className="text-purple-400">{viewingItem.artist}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {viewingItem && viewingItem.lyrics && (
                <pre className="whitespace-pre-wrap font-sans text-foreground text-sm leading-relaxed">
                  {viewingItem.lyrics}
                </pre>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{selectedItem?.title}" by {selectedItem?.artist} from your favorites?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FavoritesPage;

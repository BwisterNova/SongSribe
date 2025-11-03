import { useState } from "react";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import SearchSection from "./SearchSection";
import ResultsCard from "./ResultsCard";
import FloatingOrb from "./FloatingOrb";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { Card, CardContent } from "./ui/card";
import { Music, Download, Zap, Star, Menu, DollarSign, MessageCircle, User, History, FileText, Plus, ChevronLeft, ChevronRight, HeadphonesIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  lyrics: string;
}

function Home() {
  const [songData, setSongData] = useState<SongData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showOrb, setShowOrb] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedSong, setRecognizedSong] = useState<{ name: string; artist: string } | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const { toast } = useToast();

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Music Teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "SongScribe is amazing! I can finally get lyrics for all my favorite songs instantly."
    },
    {
      name: "Mike Chen",
      role: "DJ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      text: "The audio recognition feature is incredibly accurate. Best lyrics app I've used!"
    },
    {
      name: "Emma Davis",
      role: "Musician",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      text: "Love the download options! Perfect for creating lyric sheets for my band."
    }
  ];

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setSongData({
        title: "Example Song",
        artist: "Example Artist",
        albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
        lyrics: `[Verse 1]\nExample lyrics line 1\nExample lyrics line 2\nExample lyrics line 3\n\n[Chorus]\nExample chorus line 1\nExample chorus line 2\n\n[Verse 2]\nExample lyrics line 4\nExample lyrics line 5`,
      });
      setIsLoading(false);
      toast({
        title: "Song identified!",
        description: "Lyrics loaded successfully.",
      });
    }, 2000);
  };

  const handleMicClick = () => {
    setShowOrb(true);
    setIsListening(true);
    setRecognizedSong(undefined);

    toast({
      title: "🎵 Identifying song...",
      description: "Listening to audio...",
    });

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        const mockSong = { name: "Example Song", artist: "Example Artist" };
        setRecognizedSong(mockSong);
        setIsListening(false);

        toast({
          title: "✅ Song found!",
          description: `${mockSong.name} by ${mockSong.artist}`,
        });

        // Check if lyrics are available
        const hasLyrics = Math.random() > 0.1; // 90% chance of having lyrics

        setTimeout(() => {
          if (hasLyrics) {
            setSongData({
              title: mockSong.name,
              artist: mockSong.artist,
              albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80",
              lyrics: `[Verse 1]\nExample lyrics line 1\nExample lyrics line 2\nExample lyrics line 3\n\n[Chorus]\nExample chorus line 1\nExample chorus line 2`,
            });
            setShowOrb(false);
            setRecognizedSong(undefined);
          } else {
            // Lyrics not found
            setShowOrb(false);
            setRecognizedSong(undefined);
            toast({
              title: "❌ Lyrics not found",
              description: "The song was identified but lyrics are not available.",
              variant: "destructive",
            });
          }
        }, 2000);
      } else {
        setIsListening(false);
        toast({
          title: "❌ Song not found",
          description: "Could not identify the song. Please try again.",
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleOrbDismiss = () => {
    setShowOrb(false);
    setIsListening(false);
    setRecognizedSong(undefined);
  };

  const handleDownload = (format: "pdf" | "docx" | "txt") => {
    toast({
      title: `Downloading ${format.toUpperCase()}`,
      description: "File generation with QR codes will be implemented.",
    });
  };

  const handleCloseLyrics = () => {
    setSongData(undefined);
  };

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Sidebar */}
      <Sidebar
        isMobile
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isCollapsed={false}
        onToggle={() => {}}
      />

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-purple-500/20 px-6 py-4"
        style={{ left: sidebarCollapsed ? "80px" : "256px" }}
      >
        <div className="flex items-center justify-end gap-6">
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            <DollarSign className="w-4 h-4 mr-1" />
            Pricing
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-purple-400">
            <MessageCircle className="w-4 h-4 mr-1" />
            Support
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-purple-400">
            <User className="w-4 h-4" />
            My Account
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-foreground hover:text-purple-400">
            <MessageCircle className="w-4 h-4 mr-1" />
            Support
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-purple-400">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        } pt-16 lg:pt-20`}
      >
        {/* Hero Section */}
        <section className="pt-12 lg:pt-12 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <Logo />
            <SearchSection
              onSearch={handleSearch}
              onMicClick={handleMicClick}
              isLoading={isLoading}
            />
            <ResultsCard
              songData={songData}
              isLoading={isLoading}
              onDownload={handleDownload}
              onClose={handleCloseLyrics}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 lg:py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-center text-muted-foreground mb-8 lg:mb-12 text-base lg:text-lg">
              Everything you need to identify and download song lyrics
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mb-4">
                    <Music className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">Audio Recognition</h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Identify any song playing around you with our advanced audio recognition technology
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mb-4">
                    <Download className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">Multi-Format Export</h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Download lyrics in PDF, DOCX, or TXT format with branded QR codes
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mb-4">
                    <Zap className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">Lightning Fast</h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Get accurate lyrics in seconds from Spotify, YouTube, Apple Music, SoundCloud, Boomplay, Deezer, and Audiomack URLs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 lg:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-center text-muted-foreground mb-8 lg:mb-12 text-base lg:text-lg">
              Three simple steps to get your lyrics
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2">Search or Listen</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Paste a song URL or use the microphone to identify music
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2">View Lyrics</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  See accurate, formatted lyrics with song metadata
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2">Download</h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Export in your preferred format with QR codes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section - Carousel */}
        <section className="py-12 lg:py-20 px-4 bg-gradient-to-b from-purple-900/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              What Users Say
            </h2>
            <p className="text-center text-muted-foreground mb-8 lg:mb-12 text-base lg:text-lg">
              Trusted by music lovers worldwide
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevReview}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-base text-muted-foreground mb-6 text-center min-h-[60px]">
                    "{reviews[currentReview].text}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={reviews[currentReview].avatar}
                      alt="User"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{reviews[currentReview].name}</p>
                      <p className="text-sm text-muted-foreground">{reviews[currentReview].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextReview}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-purple-600/20 hover:bg-purple-600/40 rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className="border-2 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-600/10"
              >
                See all Reviews
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground mb-8 lg:mb-12 text-base lg:text-lg">
              Got questions? We've got answers
            </p>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6">
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  How accurate is the audio recognition?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Our audio recognition technology is powered by advanced AI and has a 95%+ accuracy rate for identifying songs from major streaming platforms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6">
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  What formats can I download lyrics in?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  You can download lyrics in PDF, DOCX (Microsoft Word), and TXT formats. All downloads include branded QR codes linking to the original song and SongScribe.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6">
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Which music platforms are supported?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  SongScribe supports Spotify, YouTube, Apple Music, SoundCloud, Boomplay, Deezer, and Audiomack URLs. Simply paste the link and we'll fetch the lyrics for you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6">
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Is there a limit to how many songs I can search?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Free users can search up to 10 songs per day. Premium users get unlimited searches and additional features like bulk downloads.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6">
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Can I use SongScribe for commercial purposes?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Yes! Our Business and Enterprise plans include commercial usage rights. Contact our support team for more information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-20 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg mb-6 lg:mb-8">
              Join thousands of music lovers using SongScribe every day
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 lg:px-8 py-5 lg:py-6 text-base lg:text-lg rounded-2xl shadow-lg"
            >
              Start Identifying Songs
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 lg:py-12 px-4 border-t border-purple-500/20">
          <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm lg:text-base">
            <p>© 2024 SongScribe. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {fabExpanded && (
          <>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg px-6 gap-2"
            >
              <HeadphonesIcon className="w-5 h-5" />
              <span>Support/Contact</span>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg px-6 gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>Notes</span>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg px-6 gap-2"
            >
              <History className="w-5 h-5" />
              <span>Lyrics History</span>
            </Button>
          </>
        )}
        <Button
          size="icon"
          onClick={() => setFabExpanded(!fabExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl"
        >
          <Plus className={`w-6 h-6 transition-transform duration-300 ${fabExpanded ? "rotate-45" : ""}`} />
        </Button>
      </div>

      <Toaster />
      
      {showOrb && (
        <FloatingOrb
          isListening={isListening}
          songName={recognizedSong?.name}
          artist={recognizedSong?.artist}
          onDismiss={handleOrbDismiss}
        />
      )}
    </div>
  );
}

export default Home;
import { useState } from "react";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import SearchSection from "./SearchSection";
import ResultsCard from "./ResultsCard";
import FloatingOrb from "./FloatingOrb";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { Card, CardContent } from "./ui/card";
import {
  Music,
  Download,
  Zap,
  Star,
  Menu,
  DollarSign,
  MessageCircle,
  User,
  History,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { identifySongByUrl, identifySongByAudio } from "../lib/identifySong";

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
  const [recognizedSong, setRecognizedSong] = useState<
    { name: string; artist: string } | undefined
  >(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [currentReview, setCurrentReview] = useState(0);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { toast } = useToast();

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Music Teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      text: "SongScribe is amazing! I can finally get lyrics for all my favorite songs instantly.",
    },
    {
      name: "Mike Chen",
      role: "DJ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      text: "The audio recognition feature is incredibly accurate. Best lyrics app I've used!",
    },
    {
      name: "Emma Davis",
      role: "Musician",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      text: "Love the download options! Perfect for creating lyric sheets for my band.",
    },
  ];

  const handleSearch = async (url: string) => {
    setIsLoading(true);

    try {
      const result = await identifySongByUrl(url);

      if (result) {
        setSongData(result);
        toast({
          title: "Song identified!",
          description: "Lyrics loaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description:
          error instanceof Error ? error.message : "Failed to identify song",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    setShowOrb(true);
    setIsListening(true);
    setRecognizedSong(undefined);

    toast({
      title: "🎵 Identifying song...",
      description: "Listening to audio...",
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });

        try {
          const result = await identifySongByAudio(audioBlob);

          if (result) {
            setRecognizedSong({ name: result.title, artist: result.artist });
            setIsListening(false);

            toast({
              title: "✅ Song found!",
              description: `${result.title} by ${result.artist}`,
            });

            setTimeout(() => {
              if (result.lyrics) {
                setSongData(result);
                setShowOrb(false);
                setRecognizedSong(undefined);
              } else {
                setShowOrb(false);
                setRecognizedSong(undefined);
                toast({
                  title: "❌ Lyrics not found",
                  description:
                    "The song was identified but lyrics are not available.",
                  variant: "destructive",
                });
              }
            }, 2000);
          }
        } catch (error) {
          setIsListening(false);
          toast({
            title: "❌ Song not found",
            description:
              error instanceof Error
                ? error.message
                : "Could not identify the song. Please try again.",
            variant: "destructive",
          });
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setAudioRecorder(recorder);

      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 5000);
    } catch (error) {
      setIsListening(false);
      setShowOrb(false);
      toast({
        title: "❌ Microphone access denied",
        description: "Please allow microphone access to identify songs.",
        variant: "destructive",
      });
    }
  };

  const handleOrbDismiss = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
    }
    setShowOrb(false);
    setIsListening(false);
    setRecognizedSong(undefined);
  };

  const handleDownload = async (format: "pdf" | "docx" | "txt") => {
    if (!songData) return;

    try {
      const content = `${songData.title}\nby ${songData.artist}\n\n${songData.lyrics}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${songData.title} - ${songData.artist}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: `✅ Downloaded ${format.toUpperCase()}`,
        description: `${songData.title} lyrics saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "❌ Download failed",
        description: "Could not download the file. Please try again.",
        variant: "destructive",
      });
    }
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
      <div
        className="hidden lg:block fixed top-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-purple-500/20 px-6 py-4"
        style={{ left: sidebarCollapsed ? "80px" : "256px" }}
      >
        <div className="flex items-center justify-end gap-6">
          <Button
            variant="ghost"
            className="text-foreground hover:text-purple-400"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Pricing
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-purple-400"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Support
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-foreground hover:text-purple-400"
          >
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
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground hover:text-purple-400 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          <span>My Account</span>
        </Button>
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
                  <h3 className="text-lg lg:text-xl font-bold mb-2">
                    Audio Recognition
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Identify any song playing around you with our advanced audio
                    recognition technology
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mb-4">
                    <Download className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">
                    Multi-Format Export
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Download lyrics in PDF, DOCX, or TXT format with branded QR
                    codes
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-2xl w-fit mb-4">
                    <Zap className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Get accurate lyrics in seconds from Spotify, YouTube, Apple
                    Music, SoundCloud, Boomplay, Deezer, and Audiomack URLs
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
                <h3 className="text-lg lg:text-xl font-bold mb-2">
                  Search or Listen
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground">
                  Paste a song URL or use the microphone to identify music
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-2">
                  View Lyrics
                </h3>
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
              <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-500 text-yellow-500"
                      />
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
                      <p className="font-semibold">
                        {reviews[currentReview].name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reviews[currentReview].role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevReview}
                      className="bg-purple-600/20 hover:bg-purple-600/40 rounded-full"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextReview}
                      className="bg-purple-600/20 hover:bg-purple-600/40 rounded-full"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
              <AccordionItem
                value="item-1"
                className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6"
              >
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  How accurate is the audio recognition?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Our audio recognition technology is powered by advanced AI and
                  has a 95%+ accuracy rate for identifying songs from major
                  streaming platforms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6"
              >
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  What formats can I download lyrics in?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  You can download lyrics in PDF, DOCX (Microsoft Word), and TXT
                  formats. All downloads include branded QR codes linking to the
                  original song and SongScribe.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6"
              >
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Which music platforms are supported?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  SongScribe supports Spotify, YouTube, Apple Music, SoundCloud,
                  Boomplay, Deezer, and Audiomack URLs. Simply paste the link
                  and we'll fetch the lyrics for you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6"
              >
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Is there a limit to how many songs I can search?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Free users can search up to 10 songs per day. Premium users
                  get unlimited searches and additional features like bulk
                  downloads.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 rounded-2xl px-4 lg:px-6"
              >
                <AccordionTrigger className="text-base lg:text-lg font-semibold hover:text-purple-400">
                  Can I use SongScribe for commercial purposes?
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground">
                  Yes! Our Business and Enterprise plans include commercial
                  usage rights. Contact our support team for more information.
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
        <footer className="py-12 lg:py-16 px-4 border-t border-purple-500/20 bg-gradient-to-b from-transparent to-purple-900/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Logo & Discord */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    SongScribe
                  </span>
                </div>
                <Button
                  onClick={() =>
                    window.open("https://discord.gg/songscribe", "_blank")
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord
                </Button>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-purple-400">
                  Resources
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      Step-by-Step Guide
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      How to get lyrics
                    </Button>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-purple-400">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      Privacy
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      FAQ
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      Terms of Service
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant="link"
                      className="text-muted-foreground hover:text-purple-400 p-0 h-auto"
                    >
                      Refund Policy
                    </Button>
                  </li>
                </ul>
              </div>

              {/* Get In Touch */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-purple-400">
                  Get In Touch
                </h3>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg">
                  Get In Touch
                </Button>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-muted-foreground text-sm lg:text-base pt-8 border-t border-purple-500/20">
              <p>© 2025 SongScribe. All rights reserved.</p>
            </div>
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
          <Plus
            className={`w-6 h-6 transition-transform duration-300 ${fabExpanded ? "rotate-45" : ""}`}
          />
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
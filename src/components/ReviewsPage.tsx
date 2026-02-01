import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";

interface ReviewsPageProps {
  onBack: () => void;
}

const allReviews = [
  {
    name: "Sarah Johnson",
    role: "Music Teacher",
    text: "SongScribe is amazing! I can finally get lyrics for all my favorite songs instantly. It has made my lesson planning so much easier.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "DJ",
    text: "The audio recognition feature is incredibly accurate. Best lyrics app I've used! I use it every weekend at my gigs.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Musician",
    text: "Love the download options! Perfect for creating lyric sheets for my band. The QR code feature is genius.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Podcast Host",
    text: "I use SongScribe to identify songs for my music podcast segments. The accuracy is unmatched and the speed is impressive.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Karaoke Enthusiast",
    text: "Finally a reliable way to get accurate lyrics for my karaoke nights! No more guessing the words. Highly recommend!",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Music Producer",
    text: "As a producer, I need quick access to lyrics for reference. SongScribe delivers every time with professional-grade accuracy.",
    rating: 4,
  },
  {
    name: "Rachel Green",
    role: "Content Creator",
    text: "The multi-format export is a game-changer for my content creation workflow. PDF exports look professional and clean.",
    rating: 5,
  },
  {
    name: "Carlos Martinez",
    role: "Music Blogger",
    text: "I've tried many lyrics apps but SongScribe is by far the best. The interface is beautiful and the results are instant.",
    rating: 5,
  },
  {
    name: "Amy Zhang",
    role: "Voice Coach",
    text: "My students love when I print out lyrics for practice sessions. SongScribe has become an essential tool in my teaching.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Wedding DJ",
    text: "When guests request songs, I can quickly identify them and even share lyrics. It's made my job so much easier!",
    rating: 4,
  },
];

function ReviewsPage({ onBack }: ReviewsPageProps) {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 pt-20 lg:pt-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-purple-600/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              All Reviews
            </h1>
            <p className="text-muted-foreground text-sm">
              What our users are saying about SongScribe
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {allReviews.map((review, index) => (
            <Card
              key={index}
              className="bg-card/50 dark:bg-card/50 backdrop-blur-sm border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm lg:text-base text-muted-foreground mb-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 mb-8">
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/20">
            <CardContent className="py-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    4.9
                  </p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    10K+
                  </p>
                  <p className="text-sm text-muted-foreground">Happy Users</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    50K+
                  </p>
                  <p className="text-sm text-muted-foreground">Songs Identified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;

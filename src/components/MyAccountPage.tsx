import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  User,
  Calendar,
  Crown,
  Edit,
  LogOut,
  Trash2,
  Music,
  FileText,
  Heart,
  Camera,
  Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MyAccountPageProps {
  onBack: () => void;
  onNavigateToPricing?: () => void;
}

function MyAccountPage({ onBack, onNavigateToPricing }: MyAccountPageProps) {
  const { user, signOut } = useAuth();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User");
  const [editName, setEditName] = useState(displayName);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userEmail = user?.email || "No email";
  const userAvatar = customAvatar || user?.user_metadata?.avatar_url || null;
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  const userStats = {
    lyricsSearched: 156,
    notesSaved: 23,
    favorites: 45,
    memberSince,
  };

  const currentPlan = {
    name: "Free",
    features: ["5 searches/day", "TXT downloads", "Basic support"],
  };

  const handleSaveProfile = () => {
    setDisplayName(editName);
    setEditProfileOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onBack();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
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
              My Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your profile and subscription
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-purple-600 to-blue-600" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={userAvatar || undefined} />
                    <AvatarFallback className="text-2xl bg-purple-600 text-white">
                      {displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 text-center sm:text-left pb-4">
                  <h2 className="text-xl font-bold text-foreground">{displayName}</h2>
                  <p className="text-muted-foreground text-sm">{userEmail}</p>
                </div>
                <Button
                  variant="outline"
                  className="border-purple-500/30 mb-4"
                  onClick={() => {
                    setEditName(displayName);
                    setEditProfileOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Music, label: "Lyrics Searched", value: userStats.lyricsSearched, color: "text-purple-400" },
              { icon: FileText, label: "Notes Saved", value: userStats.notesSaved, color: "text-blue-400" },
              { icon: Heart, label: "Favorites", value: userStats.favorites, color: "text-red-400" },
              { icon: Calendar, label: "Member Since", value: userStats.memberSince, color: "text-green-400" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-card/50 dark:bg-card/50 border-purple-500/20 p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>

          {/* Subscription */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  Current Plan
                </h3>
                <Badge className="bg-gray-500/20 text-gray-400">
                  {currentPlan.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={onNavigateToPricing}
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground">
                Account Actions
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <AlertDialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-purple-500/20 hover:bg-purple-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out? You'll need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleSignOut}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all associated data including lyrics history, notes, and favorites. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-purple-500/30">
                  <AvatarImage src={userAvatar || undefined} />
                  <AvatarFallback className="text-2xl bg-purple-600 text-white">
                    {displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
            
            <div className="border-t border-purple-500/20 pt-4">
              <Label className="text-foreground">Display Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="bg-purple-500/10 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Email: </span>
                {userEmail}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Email is managed by your Google account
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyAccountPage;

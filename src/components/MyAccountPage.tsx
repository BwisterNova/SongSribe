import { useState } from "react";
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
  Mail,
  Calendar,
  Crown,
  Edit,
  LogOut,
  Trash2,
  Music,
  FileText,
  Heart,
  Camera,
} from "lucide-react";

interface MyAccountPageProps {
  onBack: () => void;
  onNavigateToPricing?: () => void;
}

function MyAccountPage({ onBack, onNavigateToPricing }: MyAccountPageProps) {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  const userStats = {
    lyricsSearched: 156,
    notesSaved: 23,
    favorites: 45,
    memberSince: "January 2024",
  };

  const currentPlan = {
    name: "Free",
    features: ["5 searches/day", "TXT downloads", "Basic support"],
  };

  const handleSaveProfile = () => {
    setName(editName);
    setEmail(editEmail);
    setEditProfileOpen(false);
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
                    <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" />
                    <AvatarFallback className="text-2xl bg-purple-600">
                      {name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 text-center sm:text-left pb-4">
                  <h2 className="text-xl font-bold text-foreground">{name}</h2>
                  <p className="text-muted-foreground text-sm">{email}</p>
                </div>
                <Button
                  variant="outline"
                  className="border-purple-500/30 mb-4"
                  onClick={() => {
                    setEditName(name);
                    setEditEmail(email);
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
              <Button
                variant="outline"
                className="w-full justify-start border-purple-500/20 hover:bg-purple-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
              
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
            <div>
              <Label className="text-foreground">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            <div>
              <Label className="text-foreground">Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
              />
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

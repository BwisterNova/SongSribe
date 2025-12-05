import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Bell,
  Globe,
  Moon,
  Sun,
  Volume2,
  Download,
  Shield,
  Trash2,
} from "lucide-react";
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

interface SettingsPageProps {
  onBack: () => void;
}

function SettingsPage({ onBack }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [language, setLanguage] = useState("en");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("light") ? "light" : "dark";
    }
    return "dark";
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      document.body.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.body.classList.remove("light");
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
              Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Customize your SongScribe experience
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sun className="w-5 h-5 text-purple-400" />
                Appearance
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-32 bg-background/50 dark:bg-background/50 border-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">
                      <span className="flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Dark
                      </span>
                    </SelectItem>
                    <SelectItem value="light">
                      <span className="flex items-center gap-2">
                        <Sun className="w-4 h-4" /> Light
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Notifications
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for actions
                  </p>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                />
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-400" />
                Downloads
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Default Format</Label>
                  <p className="text-sm text-muted-foreground">
                    Preferred download format
                  </p>
                </div>
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger className="w-32 bg-background/50 dark:bg-background/50 border-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Auto-Download</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically download after identification
                  </p>
                </div>
                <Switch
                  checked={autoDownload}
                  onCheckedChange={setAutoDownload}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Language & Region
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40 bg-background/50 dark:bg-background/50 border-purple-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="bg-card/50 dark:bg-card/50 border-purple-500/20">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Privacy & Data
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Clear History</Label>
                  <p className="text-sm text-muted-foreground">
                    Delete all your lyrics and note history
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your lyrics history and saved notes. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

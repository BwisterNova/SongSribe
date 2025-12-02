import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  FileText,
  ArrowLeft,
} from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteHistoryPageProps {
  onBack: () => void;
  notes?: NoteItem[];
  onCreateNote?: (note: { title: string; content: string }) => void;
  onEditNote?: (id: string, note: { title: string; content: string }) => void;
  onDeleteNote?: (id: string) => void;
}

function NoteHistoryPage({
  onBack,
  notes = [
    {
      id: "1",
      title: "Song Ideas",
      content: "Need to find more songs like Blinding Lights for the playlist...",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Favorite Lyrics",
      content: "The lyrics from Bohemian Rhapsody are incredible...",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
  ],
  onCreateNote,
  onEditNote,
  onDeleteNote,
}: NoteHistoryPageProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const handleCreateNote = () => {
    setNoteTitle("");
    setNoteContent("");
    setCreateDialogOpen(true);
  };

  const handleSaveNewNote = () => {
    if (noteTitle.trim() && onCreateNote) {
      onCreateNote({ title: noteTitle, content: noteContent });
    }
    setCreateDialogOpen(false);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleEditNote = (note: NoteItem) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditDialogOpen(true);
  };

  const handleSaveEditedNote = () => {
    if (selectedNote && noteTitle.trim() && onEditNote) {
      onEditNote(selectedNote.id, { title: noteTitle, content: noteContent });
    }
    setEditDialogOpen(false);
    setSelectedNote(null);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleDeleteNote = (note: NoteItem) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedNote && onDeleteNote) {
      onDeleteNote(selectedNote.id);
    }
    setDeleteDialogOpen(false);
    setSelectedNote(null);
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
              Note History
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your personal notes collection
            </p>
          </div>
        </div>

        {/* Notes Grid */}
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Create New Note Card */}
            <Card
              onClick={handleCreateNote}
              className="bg-card/30 backdrop-blur-sm border-2 border-dashed border-purple-500/30 rounded-2xl overflow-hidden hover:border-purple-500/60 transition-all cursor-pointer min-h-[200px] flex items-center justify-center group"
            >
              <div className="flex flex-col items-center gap-3 text-purple-400/70 group-hover:text-purple-400 transition-colors">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-medium">Create New Note</span>
              </div>
            </Card>

            {/* Existing Notes */}
            {notes.map((note) => (
              <Card
                key={note.id}
                className="bg-card/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all group"
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-white truncate max-w-[150px]">
                        {note.title}
                      </h3>
                    </div>
                    
                    {/* Action Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleEditNote(note)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Note
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteNote(note)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
                    {note.content || "No content"}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-purple-500/10">
                    Updated {note.updatedAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Create Note Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Input
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
                className="bg-background/50 border-purple-500/20 focus:border-purple-500/50 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewNote}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Edit Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Input
                placeholder="Note title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={6}
                className="bg-background/50 border-purple-500/20 focus:border-purple-500/50 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditedNote}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedNote?.title}"? This action cannot be undone.
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

export default NoteHistoryPage;

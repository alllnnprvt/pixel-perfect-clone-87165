import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import NoteCard from "@/components/NoteCard";
import BlobBackground from "@/components/BlobBackground";
import HandDrawnUnderline from "@/components/HandDrawnUnderline";
import { Plus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, title, created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (!error && data) setNotes(data);
      setLoading(false);
    };

    if (user) fetchNotes();
  }, [user]);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-12 py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Hey, {userName} 👋
            </h1>
            <div className="w-24 -mt-1">
              <HandDrawnUnderline />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              className="rounded-2xl"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="rounded-2xl"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Notes Grid */}
        <main className="px-6 sm:px-12 pb-24">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No notes yet!</p>
              <p className="text-muted-foreground">Upload your first study notes to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, i) => (
                <NoteCard
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  createdAt={note.created_at}
                  index={i}
                />
              ))}
            </div>
          )}
        </main>

        {/* FAB */}
        <button
          onClick={() => navigate("/upload")}
          className="fab"
          aria-label="Upload new notes"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

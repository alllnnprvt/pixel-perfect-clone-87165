import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import BlobBackground from "@/components/BlobBackground";
import HandDrawnUnderline from "@/components/HandDrawnUnderline";
import { ArrowLeft, FileText, Mail, User as UserIcon } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [noteCount, setNoteCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user?.id);
      setNoteCount(count || 0);
    };
    if (user) fetchCount();
  }, [user]);

  const userName = user?.user_metadata?.full_name || "Student";
  const email = user?.email || "";

  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      <div className="relative z-10 max-w-lg mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">Profile</h1>
        <div className="w-20 mb-8">
          <HandDrawnUnderline />
        </div>

        <div className="card-organic p-8 border border-border space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{userName}</h2>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Notes uploaded</p>
                <p className="font-medium text-foreground">{noteCount}</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={async () => { await signOut(); navigate("/login"); }}
            className="w-full rounded-2xl h-12"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

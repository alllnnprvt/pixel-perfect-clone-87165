import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadTabs from "@/components/UploadTabs";
import LoadingScreen from "@/components/LoadingScreen";
import BlobBackground from "@/components/BlobBackground";
import HandDrawnUnderline from "@/components/HandDrawnUnderline";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter a title and some notes");
      return;
    }

    setGenerating(true);

    try {
      setStep(0);
      const { data: aiData, error: aiError } = await supabase.functions.invoke(
        "generate-study-materials",
        { body: { noteText: content } }
      );

      if (aiError) throw new Error(aiError.message || "AI generation failed");
      if (aiData?.error) throw new Error(aiData.error);

      setStep(1);
      const { flashcards, quiz, explanations } = aiData;

      setStep(2);
      const { data, error } = await supabase
        .from("notes")
        .insert({
          user_id: user?.id,
          title,
          raw_text: content,
          file_type: "text",
          flashcards,
          quiz,
          explanations,
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Study materials generated!");
      navigate(`/notes/${data.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (generating) return <LoadingScreen step={step} />;

  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">Upload Notes</h1>
        <div className="w-28 mb-8">
          <HandDrawnUnderline />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Note Title</label>
            <Input
              placeholder="e.g. Biology Chapter 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-2xl h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Your Notes</label>
            <UploadTabs onContentReady={setContent} />
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full h-14 rounded-2xl text-lg font-bold"
            disabled={!title.trim() || !content.trim()}
          >
            ✨ Generate Study Materials
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;

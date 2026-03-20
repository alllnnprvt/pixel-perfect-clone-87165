import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import BlobBackground from "@/components/BlobBackground";
import HandDrawnUnderline from "@/components/HandDrawnUnderline";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Brain, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const features = [
    { icon: Sparkles, title: "AI Flashcards", desc: "Auto-generated from your notes" },
    { icon: Brain, title: "Smart Quizzes", desc: "Test your knowledge instantly" },
    { icon: FileText, title: "Explanations", desc: "Complex concepts made simple" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BlobBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">NoteGenius</h1>
          </div>
          <div className="w-40 mx-auto mb-6">
            <HandDrawnUnderline />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto mb-10">
            Upload your study notes and let AI create flashcards, quizzes, and explanations for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate("/signup")}
              className="h-14 px-8 rounded-2xl text-lg font-bold"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 px-8 rounded-2xl text-lg font-semibold"
            >
              Sign In
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                className="card-organic p-6 border border-border text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

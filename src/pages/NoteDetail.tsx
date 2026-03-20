import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import FlashCard from "@/components/FlashCard";
import QuizQuestion from "@/components/QuizQuestion";
import ExplanationCard from "@/components/ExplanationCard";
import BlobBackground from "@/components/BlobBackground";
import HandDrawnUnderline from "@/components/HandDrawnUnderline";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteData {
  id: string;
  title: string;
  raw_text: string;
  flashcards: { question: string; answer: string }[];
  quiz: { question: string; options: string[]; answer: string }[];
  explanations: { concept: string; explanation: string }[];
}

const tabs = ["Original", "Flashcards", "Quiz", "Explanations"] as const;

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Original");
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setNote({
          ...data,
          flashcards: data.flashcards as any || [],
          quiz: data.quiz as any || [],
          explanations: data.explanations as any || [],
        });
      }
      setLoading(false);
    };
    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-xl text-muted-foreground">Note not found</p>
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="rounded-2xl">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (quizIndex < note.quiz.length - 1) {
        setQuizIndex((i) => i + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen relative">
      <BlobBackground />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-1">{note.title}</h1>
        <div className="w-32 mb-8">
          <HandDrawnUnderline />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "Original" && (
              <div className="card-organic p-6 sm:p-8 border border-border">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed">{note.raw_text}</p>
              </div>
            )}

            {activeTab === "Flashcards" && note.flashcards.length > 0 && (
              <div>
                <div className="text-center mb-4 text-sm text-muted-foreground">
                  {flashcardIndex + 1} / {note.flashcards.length}
                </div>
                <FlashCard
                  key={flashcardIndex}
                  question={note.flashcards[flashcardIndex].question}
                  answer={note.flashcards[flashcardIndex].answer}
                />
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setFlashcardIndex(Math.max(0, flashcardIndex - 1))}
                    disabled={flashcardIndex === 0}
                    className="rounded-2xl"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setFlashcardIndex(Math.min(note.flashcards.length - 1, flashcardIndex + 1))}
                    disabled={flashcardIndex === note.flashcards.length - 1}
                    className="rounded-2xl"
                  >
                    Next <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "Quiz" && note.quiz.length > 0 && (
              <div>
                {quizFinished ? (
                  <div className="text-center card-organic p-8 border border-border">
                    <p className="text-4xl font-bold text-foreground mb-2">
                      {quizScore} / {note.quiz.length}
                    </p>
                    <p className="text-muted-foreground mb-6">
                      {quizScore === note.quiz.length ? "Perfect score! 🎉" : "Keep studying! 💪"}
                    </p>
                    <Button
                      onClick={() => { setQuizIndex(0); setQuizScore(0); setQuizFinished(false); }}
                      className="rounded-2xl"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-4 text-sm text-muted-foreground">
                      Question {quizIndex + 1} / {note.quiz.length}
                    </div>
                    <QuizQuestion
                      key={quizIndex}
                      question={note.quiz[quizIndex].question}
                      options={note.quiz[quizIndex].options}
                      correctAnswer={note.quiz[quizIndex].answer}
                      onAnswer={handleQuizAnswer}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "Explanations" && (
              <div className="space-y-4">
                {note.explanations.map((exp, i) => (
                  <ExplanationCard
                    key={i}
                    concept={exp.concept}
                    explanation={exp.explanation}
                    index={i}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NoteDetail;

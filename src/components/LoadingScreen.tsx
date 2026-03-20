import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, Sparkles } from "lucide-react";

const messages = [
  { icon: BookOpen, text: "Reading your notes..." },
  { icon: Brain, text: "Generating flashcards..." },
  { icon: Sparkles, text: "Creating quiz questions..." },
];

interface LoadingScreenProps {
  step?: number;
}

const LoadingScreen = ({ step = 0 }: LoadingScreenProps) => {
  const current = messages[Math.min(step, messages.length - 1)];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center"
        >
          <Icon className="w-10 h-10 text-primary" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-semibold text-foreground"
          >
            {current.text}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-2">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;

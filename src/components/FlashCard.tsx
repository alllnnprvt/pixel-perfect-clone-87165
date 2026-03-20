import { useState } from "react";
import { motion } from "framer-motion";

interface FlashCardProps {
  question: string;
  answer: string;
}

const FlashCard = ({ question, answer }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer w-full max-w-lg mx-auto"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full min-h-[280px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 card-organic p-8 flex flex-col items-center justify-center border border-border"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Question</span>
          <p className="text-lg font-semibold text-card-foreground text-center leading-relaxed">{question}</p>
          <span className="mt-6 text-sm text-muted-foreground">Tap to flip</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 card-organic p-8 flex flex-col items-center justify-center bg-primary text-primary-foreground border border-primary"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-xs uppercase tracking-widest opacity-70 mb-4">Answer</span>
          <p className="text-lg font-medium text-center leading-relaxed">{answer}</p>
          <span className="mt-6 text-sm opacity-70">Tap to flip</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashCard;

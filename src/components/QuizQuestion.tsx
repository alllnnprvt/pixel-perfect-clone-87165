import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswer: (isCorrect: boolean) => void;
}

const QuizQuestion = ({ question, options, correctAnswer, onAnswer }: QuizQuestionProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    onAnswer(option === correctAnswer);
  };

  const getOptionStyle = (option: string) => {
    if (!selected) return "border-border hover:border-primary/40 hover:bg-secondary";
    if (option === correctAnswer) return "border-green-500 bg-green-50 text-green-800";
    if (option === selected) return "border-red-400 bg-red-50 text-red-700";
    return "border-border opacity-50";
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="text-lg font-semibold text-foreground mb-6 leading-relaxed">{question}</p>
      <div className="space-y-3">
        {options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={!selected ? { scale: 1.01 } : {}}
            whileTap={!selected ? { scale: 0.99 } : {}}
            onClick={() => handleSelect(option)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-colors flex items-center gap-3 ${getOptionStyle(option)}`}
          >
            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{option}</span>
            {selected && option === correctAnswer && <Check className="w-5 h-5 text-green-600" />}
            {selected && option === selected && option !== correctAnswer && <X className="w-5 h-5 text-red-500" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;

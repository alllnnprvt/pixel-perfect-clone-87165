import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface ExplanationCardProps {
  concept: string;
  explanation: string;
  index: number;
}

const ExplanationCard = ({ concept, explanation, index }: ExplanationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="card-organic p-6 border border-border"
  >
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0 mt-1">
        <Lightbulb className="w-5 h-5 text-accent-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2">{concept}</h3>
        <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
    </div>
  </motion.div>
);

export default ExplanationCard;

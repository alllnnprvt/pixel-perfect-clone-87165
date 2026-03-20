import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar } from "lucide-react";

interface NoteCardProps {
  id: string;
  title: string;
  createdAt: string;
  index: number;
}

const NoteCard = ({ id, title, createdAt, index }: NoteCardProps) => {
  const navigate = useNavigate();
  const staggerOffset = index % 3 === 1 ? "mt-6" : index % 3 === 2 ? "mt-3" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`${staggerOffset}`}
    >
      <div
        onClick={() => navigate(`/notes/${id}`)}
        className="card-organic p-6 cursor-pointer border border-border group"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;

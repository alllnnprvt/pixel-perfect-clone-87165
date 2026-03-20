import { motion } from "framer-motion";

const BlobBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="blob w-[600px] h-[600px] -top-32 -left-32"
        animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob w-[500px] h-[500px] top-1/2 -right-48"
        animate={{ y: [0, -25, 0], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob w-[400px] h-[400px] -bottom-24 left-1/3"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default BlobBackground;

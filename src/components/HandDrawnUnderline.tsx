const HandDrawnUnderline = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 12"
    className={`w-full h-3 ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M2 8 C 30 2, 60 12, 100 6 S 170 2, 198 8"
      stroke="hsl(var(--accent))"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default HandDrawnUnderline;

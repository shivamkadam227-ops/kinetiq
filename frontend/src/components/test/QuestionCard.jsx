"use client";
export default function QuestionCard({ question, selectedAnswer, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed">{question.question}</h2>
      <div className="space-y-3">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => onSelect(i)}
            className={[
              "w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-200",
              selectedAnswer === i
                ? "bg-purple-500/15 border-purple-500/30 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/5 hover:border-white/10"
            ].join(" ")}>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 text-xs font-semibold mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
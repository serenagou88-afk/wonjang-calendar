import React from "react";

const FEEDBACK_LINK = "https://forms.gle/CsCuQDrU1RQQuFT56";

function FeedbackButton({ className = "" }) {
  return (
    <a
      href={FEEDBACK_LINK}
      target="_blank"
      rel="noreferrer"
      className={`block w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-600 ${className}`}
    >
      피드백 보내기
    </a>
  );
}

export default FeedbackButton;

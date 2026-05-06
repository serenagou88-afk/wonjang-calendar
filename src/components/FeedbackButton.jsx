import React from "react";
import { trackEvent } from "../utils/analytics.js";

const FEEDBACK_LINK = "https://forms.gle/CsCuQDrU1RQQuFT56";

function FeedbackButton({ className = "", analyticsPayload = {} }) {
  return (
    <a
      href={FEEDBACK_LINK}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("feedback_clicked", analyticsPayload)}
      className={`block w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-semibold text-slate-600 ${className}`}
    >
      피드백 보내기
    </a>
  );
}

export default FeedbackButton;

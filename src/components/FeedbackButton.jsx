import React from "react";
import { trackEvent } from "../utils/analytics.js";

const OPEN_CHAT_LINK = "https://open.kakao.com/o/pXhvcSui";

function FeedbackButton({ analyticsPayload = {} }) {
  return (
    <a
      href={OPEN_CHAT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title="다른 선생님들과 의견 나누고 업데이트 소식도 받아보세요"
      onClick={() => trackEvent("feedback_clicked", analyticsPayload)}
      className="fixed bottom-24 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#FEE500] px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.18)] ring-1 ring-yellow-300 transition hover:brightness-95 active:scale-[0.97]"
    >
      <span aria-hidden="true">💬</span>
      <span>피드백</span>
    </a>
  );
}

export default FeedbackButton;

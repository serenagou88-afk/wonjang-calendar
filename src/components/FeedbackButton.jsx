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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#FEE500] px-3 py-2 text-xs font-bold text-[#3C1E1E] shadow-sm transition hover:brightness-95 active:scale-[0.97]"
    >
      <span aria-hidden="true">💬</span>
      <span className="whitespace-nowrap">카톡 피드백 주기</span>
    </a>
  );
}

export default FeedbackButton;

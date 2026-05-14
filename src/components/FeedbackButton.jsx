import React from "react";
import { trackEvent } from "../utils/analytics.js";

const OPEN_CHAT_LINK = "https://open.kakao.com/o/pXhvcSui";

function FeedbackButton({ className = "", analyticsPayload = {} }) {
  return (
    <a
      href={OPEN_CHAT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title="다른 선생님들과 의견 나누고 업데이트 소식도 받아보세요"
      onClick={() => trackEvent("feedback_clicked", analyticsPayload)}
      className={`block w-full rounded-2xl border border-yellow-300 bg-[#FEE500] px-4 py-4 text-center text-sm font-semibold text-slate-800 hover:brightness-95 ${className}`}
    >
      💬 사용자 모임 참여하기
    </a>
  );
}

export default FeedbackButton;

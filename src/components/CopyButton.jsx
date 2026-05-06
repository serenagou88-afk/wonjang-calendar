import React, { useState } from "react";
import { trackEvent } from "../utils/analytics.js";

function CopyButton({ text, label = "복사하기", className = "", analyticsEventName = "", analyticsPayload = {} }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      if (analyticsEventName) {
        trackEvent(analyticsEventName, analyticsPayload);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!text}
        className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {label}
      </button>
      {copied ? (
        <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
          복사되었습니다!
        </div>
      ) : null}
    </div>
  );
}

export default CopyButton;

import React, { useState } from "react";
import CopyButton from "./CopyButton.jsx";
import FeedbackButton from "./FeedbackButton.jsx";
import {
  PARENT_MESSAGE_CONTEXTS,
  PARENT_MESSAGE_TONES,
  generateParentMessage,
} from "../utils/parentMessageTemplates.js";
import { trackEvent } from "../utils/analytics.js";

function ParentMessageAssistant() {
  const [context, setContext] = useState(PARENT_MESSAGE_CONTEXTS[0].value);
  const [tone, setTone] = useState(PARENT_MESSAGE_TONES[0].value);
  const [values, setValues] = useState({ studentName: "", academyName: "", memo: "" });
  const [message, setMessage] = useState("");

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleGenerate = () => {
    trackEvent("parent_message_generate_clicked", {
      tab: "parentMessage",
      subject: "english",
      situation: context,
    });
    setMessage(generateParentMessage({ subject: "english", context, tone, values }));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">학부모 문자비서</h2>
        <p className="mt-1 text-sm text-slate-500">영어 공부방에서 자주 보내는 학부모 문자를 상황별로 만들어요.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {PARENT_MESSAGE_CONTEXTS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setContext(item.value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                context === item.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {PARENT_MESSAGE_TONES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTone(item.value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                tone === item.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">학생 이름</span>
            <input value={values.studentName} onChange={(event) => updateValue("studentName", event.target.value)} placeholder="예: 민준" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">학원명</span>
            <input value={values.academyName} onChange={(event) => updateValue("academyName", event.target.value)} placeholder="예: 루나 영어공부방" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">추가 메모</span>
            <textarea value={values.memo} onChange={(event) => updateValue("memo", event.target.value)} rows={4} placeholder="상황을 편하게 적어주세요. 입력한 문장은 참고용으로만 반영됩니다." className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white" />
          </label>

          <button type="button" onClick={handleGenerate} className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white">
            문구 만들기
          </button>
        </div>
      </section>

      {message ? (
        <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-[220px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none focus:border-slate-900 focus:bg-white" />
          <CopyButton
            text={message}
            className="mt-4"
            analyticsEventName="parent_message_copied"
            analyticsPayload={{
              tab: "parentMessage",
              subject: "english",
              situation: context,
            }}
          />
          <FeedbackButton className="mt-3" analyticsPayload={{ tab: "parentMessage" }} />
        </section>
      ) : null}
    </div>
  );
}

export default ParentMessageAssistant;

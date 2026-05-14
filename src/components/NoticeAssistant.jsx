import React, { useState } from "react";
import CopyButton from "./CopyButton.jsx";
import { NOTICE_CONTEXTS, generateNoticeMessage } from "../utils/noticeTemplates.js";
import { trackEvent } from "../utils/analytics.js";

const DEFAULT_VALUES = {
  academyName: "",
  date: "",
  time: "",
  reason: "",
  studentName: "",
  oldDate: "",
  oldTime: "",
  newDate: "",
  newTime: "",
};

const DEFAULT_FIELDS = [
  ["academyName", "학원명", "예: 루나 영어공부방"],
  ["date", "날짜", "예: 5월 5일"],
  ["time", "시간", "예: 오후 4시"],
  ["reason", "사유", "예: 어린이날"],
  ["studentName", "학생 이름", "선택 입력"],
];

const RESCHEDULE_FIELDS = [
  ["academyName", "학원명", "예: 루나 영어공부방"],
  ["studentName", "학생 이름 또는 반 이름", "예: 민준 / 초등 A반"],
  ["oldDate", "기존 날짜", "예: 5월 5일"],
  ["oldTime", "기존 시간", "예: 오후 4시"],
  ["newDate", "변경 날짜", "예: 5월 6일"],
  ["newTime", "변경 시간", "예: 오후 5시"],
  ["reason", "사유", "예: 어린이날휴무"],
];

function NoticeAssistant() {
  const [context, setContext] = useState(NOTICE_CONTEXTS[0].value);
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [message, setMessage] = useState("");
  const fields = context === "reschedule" ? RESCHEDULE_FIELDS : DEFAULT_FIELDS;

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleGenerate = () => {
    trackEvent("notice_generate_clicked", {
      tab: "notice",
      situation: context,
    });
    setMessage(generateNoticeMessage({ subject: "academy", context, values }));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">공지톡</h2>
        <p className="mt-1 text-sm text-slate-500">휴무, 보강, 테스트 같은 공지 문구를 카톡 톤으로 빠르게 만들어요.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {NOTICE_CONTEXTS.map((item) => (
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
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="space-y-4">
          {fields.map(([name, label, placeholder]) => (
            <label key={name} className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
              <input
                value={values[name]}
                onChange={(event) => updateValue(name, event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
              />
            </label>
          ))}

          <button type="button" onClick={handleGenerate} className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white">
            문구 만들기
          </button>
        </div>
      </section>

      {message ? (
        <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-[220px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none focus:border-slate-900 focus:bg-white"
          />
          <CopyButton
            text={message}
            className="mt-4"
            analyticsEventName="notice_copied"
            analyticsPayload={{
              tab: "notice",
              situation: context,
            }}
          />
        </section>
      ) : null}
    </div>
  );
}

export default NoticeAssistant;

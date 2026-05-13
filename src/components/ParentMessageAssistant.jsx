import React, { useEffect, useMemo, useState } from "react";
import CopyButton from "./CopyButton.jsx";
import FeedbackButton from "./FeedbackButton.jsx";
import {
  PARENT_MESSAGE_TONES,
  generateParentMessage,
} from "../utils/parentMessageTemplates.js";
import { trackEvent } from "../utils/analytics.js";

const DEFAULT_CONTEXT = "homework";

const INITIAL_VALUES = {
  studentName: "",
  academyName: "",
  todayProgress: "",
  todayLearning: "",
  basicHomework: "",
  extraHomework: "",
  comment: "",
};

const STORAGE_KEYS = {
  academyName: "teacher_school_name",
  studentName: "teacher_student_name",
};

const BASIC_FIELDS = [
  ["studentName", "학생 이름", "예: 민준"],
  ["todayProgress", "오늘 진도", "예: Phonics Unit 3"],
  ["basicHomework", "숙제", "예: 음원 듣기 2회"],
];

const ADVANCED_FIELDS = [
  ["academyName", "학원명", "예: 루나 영어공부방"],
  ["todayLearning", "오늘 배운 내용", "예: 단모음 a 발음"],
  ["extraHomework", "추가 숙제", "예: 단어 카드 5개 (비워두면 생략돼요)"],
];

function ParentMessageAssistant() {
  const [tone, setTone] = useState(PARENT_MESSAGE_TONES[0].value);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const academyName = window.localStorage.getItem(STORAGE_KEYS.academyName) ?? "";
      const studentName = window.localStorage.getItem(STORAGE_KEYS.studentName) ?? "";
      if (academyName || studentName) {
        setValues((current) => ({ ...current, academyName, studentName }));
      }
    } catch (error) {
      // localStorage 접근 실패(시크릿 모드 등) 시 조용히 무시
    }
  }, []);

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handlePersistBlur = (name) => () => {
    const storageKey = STORAGE_KEYS[name];
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, values[name] ?? "");
    } catch (error) {
      // 저장 실패는 조용히 무시
    }
  };

  const livePreview = useMemo(
    () => generateParentMessage({ subject: "english", context: DEFAULT_CONTEXT, tone, values }),
    [tone, values]
  );

  const hasMeaningfulContent =
    values.todayProgress.trim() !== "" ||
    values.todayLearning.trim() !== "" ||
    values.basicHomework.trim() !== "" ||
    values.extraHomework.trim() !== "" ||
    values.comment.trim() !== "";

  const handleGenerate = () => {
    trackEvent("parent_message_generate_clicked", {
      tab: "parentMessage",
      subject: "english",
      situation: DEFAULT_CONTEXT,
    });
  };

  const renderField = ([name, label, placeholder]) => (
    <label key={name} className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={values[name]}
        onChange={(event) => updateValue(name, event.target.value)}
        onBlur={STORAGE_KEYS[name] ? handlePersistBlur(name) : undefined}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
      />
    </label>
  );

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">숙제톡</h2>
        <p className="mt-1 text-sm text-slate-500">수업 후 학부모에게 보내는 숙제·학습 안내 카톡을 톤별로 만들어요.</p>

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
          {BASIC_FIELDS.map(renderField)}

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">한 줄 메모</span>
            <textarea
              value={values.comment}
              onChange={(event) => updateValue("comment", event.target.value)}
              rows={3}
              placeholder="예: 오늘 소리 구분 잘 했어요 (비워두면 생략돼요)"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowAdvanced((current) => !current)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600"
          >
            {showAdvanced ? "▲ 자세히 입력" : "▼ 자세히 입력"}
          </button>

          {showAdvanced ? (
            <div className="space-y-4">
              {ADVANCED_FIELDS.map(renderField)}
            </div>
          ) : null}

          <button type="button" onClick={handleGenerate} className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white">
            문구 만들기
          </button>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        {hasMeaningfulContent ? (
          <>
            <textarea
              value={livePreview}
              readOnly
              className="min-h-[260px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none focus:border-slate-900 focus:bg-white"
            />
            <CopyButton
              text={livePreview}
              className="mt-4"
              analyticsEventName="parent_message_copied"
              analyticsPayload={{
                tab: "parentMessage",
                subject: "english",
                situation: DEFAULT_CONTEXT,
              }}
            />
            <FeedbackButton className="mt-3" analyticsPayload={{ tab: "parentMessage" }} />
          </>
        ) : (
          <div className="rounded-3xl bg-slate-50 px-4 py-10 text-center text-sm leading-6 text-slate-400">
            위 항목을 입력하면 숙제톡이 완성돼요.
          </div>
        )}
      </section>
    </div>
  );
}

export default ParentMessageAssistant;

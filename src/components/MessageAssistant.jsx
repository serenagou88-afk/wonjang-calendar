import React, { useEffect, useMemo, useState } from "react";
import {
  MESSAGE_ASSISTANT_TONES,
  MESSAGE_TEMPLATE_OPTIONS,
  buildCalendarTemplateValues,
  generateMessage,
  getTemplateFields,
} from "../utils/messageTemplates.js";

function MessageAssistant({ calendarResult }) {
  const [messageType, setMessageType] = useState(MESSAGE_TEMPLATE_OPTIONS[0].value);
  const [tone, setTone] = useState(MESSAGE_ASSISTANT_TONES[0].value);
  const [formValues, setFormValues] = useState({});
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const currentFields = useMemo(() => getTemplateFields(messageType), [messageType]);

  useEffect(() => {
    setMessage(generateMessage({ messageType, tone, values: formValues }));
  }, [formValues, messageType, tone]);

  const handleFieldChange = (name, value) => {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLoadCalendarResult = () => {
    if (!calendarResult) return;

    setMessageType("schedule");
    setFormValues((current) => ({
      ...current,
      ...buildCalendarTemplateValues(calendarResult),
    }));
  };

  const handleRegenerate = () => {
    setMessage(generateMessage({ messageType, tone, values: formValues }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">원장님 문자비서</h2>
          <p className="mt-1 text-sm text-slate-500">
            수업 일정 없이도 자주 보내는 학부모 안내문을 바로 만들 수 있어요.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">문자 유형</label>
            <div className="grid grid-cols-2 gap-2">
              {MESSAGE_TEMPLATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMessageType(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    messageType === option.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">말투</label>
            <div className="grid grid-cols-2 gap-2">
              {MESSAGE_ASSISTANT_TONES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    tone === option.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {calendarResult ? (
            <button
              type="button"
              onClick={handleLoadCalendarResult}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700"
            >
              캘린더 결과 불러오기
            </button>
          ) : null}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">필요한 정보 입력</h3>
          <p className="mt-1 text-sm text-slate-500">선택한 문자 유형에 맞는 정보만 보여드려요.</p>
        </div>

        <div className="space-y-4">
          {currentFields.map((field) => {
            const commonClassName =
              "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-slate-900 focus:bg-white";

            return (
              <label key={field.name} className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={formValues[field.name] ?? ""}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`${commonClassName} resize-none`}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formValues[field.name] ?? ""}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                    placeholder={field.placeholder}
                    className={commonClassName}
                  />
                )}
              </label>
            );
          })}

          <button
            type="button"
            onClick={handleRegenerate}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700"
          >
            안내문 다시 생성
          </button>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">생성된 안내문</h3>
          <p className="mt-1 text-sm text-slate-500">자동 생성된 문구를 그대로 쓰거나 직접 수정할 수 있어요.</p>
        </div>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[280px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
        />

        <div className="mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition active:scale-[0.99]"
          >
            안내문 복사하기
          </button>
        </div>

        {copied ? (
          <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
            복사 완료
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default MessageAssistant;

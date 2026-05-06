import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import CalendarShareCard from "./CalendarShareCard.jsx";
import { trackEvent } from "../utils/analytics.js";

function CalendarShareSection(props) {
  const cardRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = async () => {
    if (!cardRef.current) return;

    try {
      setIsSaving(true);
      setSaveMessage("");
      trackEvent("calendar_image_save_click", {
        className: props.classNameValue,
        monthLabel: props.months?.length
          ? props.months.length === 1
            ? props.getMonthLabel(props.months[0])
            : `${props.getMonthLabel(props.months[0])} - ${props.getMonthLabel(props.months[props.months.length - 1])}`
          : "",
      });

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      const safeClassName = (props.classNameValue || "calendar").replace(/[\\/:*?"<>|]/g, "-");
      link.download = `${safeClassName}-calendar.png`;
      link.href = dataUrl;
      link.click();

      setSaveMessage("캘린더 이미지가 저장되었어요.");
    } catch (error) {
      setSaveMessage("이미지 저장에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">카톡 공지용 캘린더 이미지</h2>
        <p className="mt-1 text-sm text-slate-500">
          학부모에게 공유하기 좋은 요약 카드예요. 아래 이미지만 저장해서 바로 보낼 수 있어요.
        </p>
      </div>

      <div className="mb-4" ref={cardRef}>
        <CalendarShareCard {...props} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? "이미지 저장 중..." : "캘린더 이미지 저장"}
        </button>
      </div>

      {saveMessage ? (
        <div className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{saveMessage}</div>
      ) : null}
    </section>
  );
}

export default CalendarShareSection;

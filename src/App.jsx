import React, { useEffect, useMemo, useState } from "react";
import CalendarShareSection from "./components/CalendarShareSection.jsx";
import FeedbackButton from "./components/FeedbackButton.jsx";
import MonthlyTips from "./components/MonthlyTips.jsx";
import NoticeAssistant from "./components/NoticeAssistant.jsx";
import ParentMessageAssistant from "./components/ParentMessageAssistant.jsx";
import { initClarity, initGA, trackEvent } from "./utils/analytics.js";
import { sendTelegramAlert } from "./utils/telegram.js";

const WEEK_DAYS = [
  { label: "월", value: 1 },
  { label: "화", value: 2 },
  { label: "수", value: 3 },
  { label: "목", value: 4 },
  { label: "금", value: 5 },
  { label: "토", value: 6 },
  { label: "일", value: 0 },
];

const TONE_OPTIONS = [
  { label: "정중한", value: "formal" },
  { label: "친근한", value: "friendly" },
  { label: "짧은 카톡용", value: "short" },
];

const KOREAN_HOLIDAYS_2026 = [
  { date: "2026-01-01", name: "신정" },
  { date: "2026-02-16", name: "설날 연휴" },
  { date: "2026-02-17", name: "설날" },
  { date: "2026-02-18", name: "설날 연휴" },
  { date: "2026-03-01", name: "삼일절" },
  { date: "2026-03-02", name: "삼일절 대체공휴일" },
  { date: "2026-05-05", name: "어린이날" },
  { date: "2026-05-24", name: "부처님오신날" },
  { date: "2026-05-25", name: "부처님오신날 대체공휴일" },
  { date: "2026-06-03", name: "제9회 전국동시지방선거" },
  { date: "2026-06-06", name: "현충일" },
  { date: "2026-08-15", name: "광복절" },
  { date: "2026-08-17", name: "광복절 대체공휴일" },
  { date: "2026-09-24", name: "추석 연휴" },
  { date: "2026-09-25", name: "추석" },
  { date: "2026-09-26", name: "추석 연휴" },
  { date: "2026-10-03", name: "개천절" },
  { date: "2026-10-05", name: "개천절 대체공휴일" },
  { date: "2026-10-09", name: "한글날" },
  { date: "2026-12-25", name: "크리스마스" },
];

const BADGE_STYLES = {
  수업: "bg-sky-100 text-sky-700",
  휴무: "bg-rose-100 text-rose-700",
  공휴일: "bg-rose-100 text-rose-700",
  마지막: "bg-slate-900 text-white",
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

const getDayLabel = (date) => WEEK_DAYS.find((item) => item.value === date.getDay())?.label ?? "";

const formatDisplayDate = (value) => {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "";
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} (${getDayLabel(date)})`;
};

const formatMonthDay = (value) => {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatLongDate = (value) => {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return "";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${getDayLabel(date)}요일`;
};

const getMonthLabel = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

const getMonthRangeLabel = (months) => {
  if (!months.length) return "";
  if (months.length === 1) return getMonthLabel(months[0]);
  return `${getMonthLabel(months[0])} - ${getMonthLabel(months[months.length - 1])}`;
};

const createMonthGrid = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();
  const startDate = addDays(firstDay, -firstWeekDay);
  return Array.from({ length: 42 }, (_, index) => addDays(startDate, index));
};

const formatMissedDateItem = (item) => `${formatDisplayDate(item.date)} ${item.name}`;

const buildShareSummary = (missedDates, totalCount) => {
  if (!missedDates.length) {
    return "이번 달은 별도 휴무일 없이 정규 수업 일정에 따라 진행됩니다.";
  }

  if (missedDates.length === 1) {
    return `${formatMonthDay(missedDates[0].date)} ${missedDates[0].name}은 휴무이며, 정규 수업일 기준으로 총 ${totalCount}회 수업이 진행됩니다.`;
  }

  return `휴무일 ${missedDates.length}일을 제외하고 정규 수업일 기준으로 총 ${totalCount}회 수업이 진행됩니다.`;
};

const buildDetailedNotice = (missedDates) =>
  missedDates.map((item) => {
    if (item.source === "auto") {
      return `${formatMonthDay(item.date)} ${item.name}은 공휴일로 수업이 진행되지 않습니다.`;
    }
    return `${formatMonthDay(item.date)} ${item.name}로 수업이 진행되지 않습니다.`;
  });

const buildCalendarMessage = ({ className, missedDates, lastClassDate, totalCount, tone, months }) => {
  const monthLabel = getMonthRangeLabel(months) || "이번 일정";
  const detailLines = buildDetailedNotice(missedDates);

  if (tone === "formal") {
    const lines = [
      "안녕하세요.",
      `${className} ${monthLabel} 수업 일정 안내드립니다.`,
      "",
    ];

    if (missedDates.length) {
      lines.push(...detailLines);
      lines.push(`이후 정규 수업일에 이어서 진행되어 총 ${totalCount}회 수업으로 운영됩니다.`);
    } else {
      lines.push(`별도 휴무일 없이 정규 수업일 기준으로 총 ${totalCount}회 수업이 진행됩니다.`);
    }

    lines.push("");
    lines.push(`마지막 수업일은 ${formatLongDate(lastClassDate)}입니다.`);
    lines.push("자세한 일정은 캘린더를 참고 부탁드립니다. 감사합니다.");
    return lines.join("\n");
  }

  if (tone === "friendly") {
    const lines = [`안녕하세요 :) ${className} 수업 일정 안내드려요!`, ""];

    if (missedDates.length) {
      lines.push(...detailLines);
      lines.push(`이후 정규 수업일에 이어서 총 ${totalCount}회 수업으로 진행됩니다.`);
    } else {
      lines.push(`별도 휴무일 없이 정규 수업일 기준으로 총 ${totalCount}회 수업이 진행됩니다.`);
    }

    lines.push("");
    lines.push(`마지막 수업은 ${formatLongDate(lastClassDate)}이에요.`);
    lines.push("자세한 일정은 캘린더로 함께 확인 부탁드려요 :)");
    return lines.join("\n");
  }

  const lines = [`[${className}] 수업 일정 안내`];

  if (missedDates.length) {
    lines.push(...detailLines);
    lines.push(`이후 정규 수업일 기준 총 ${totalCount}회 진행`);
  } else {
    lines.push(`정규 수업일 기준 총 ${totalCount}회 진행`);
  }

  lines.push(`마지막 수업: ${formatLongDate(lastClassDate)}`);
  lines.push("자세한 일정은 캘린더 참고 부탁드립니다.");
  return lines.join("\n");
};

const ToggleButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
      active
        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
        : "border-slate-200 bg-white text-slate-600"
    }`}
  >
    {children}
  </button>
);

const TabButton = ({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      active ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600"
    }`}
  >
    {children}
  </button>
);

const SectionCard = ({ title, description, children }) => (
  <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    {children}
  </section>
);

const ResultList = ({ title, items, emptyText }) => (
  <div className="rounded-3xl bg-slate-50 p-4">
    <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    <div className="mt-3 space-y-2 text-sm text-slate-600">
      {items.length ? (
        items.map((item) => (
          <div key={item} className="rounded-2xl bg-white px-3 py-2">
            {item}
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white px-3 py-2 text-slate-400">{emptyText}</div>
      )}
    </div>
  </div>
);

const CalendarMonth = ({ monthDate, badgeMap }) => {
  const days = createMonthGrid(monthDate);
  const currentMonth = monthDate.getMonth();

  return (
    <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">{getMonthLabel(monthDate)}</h3>
        <span className="text-xs text-slate-400">월간 수업 캘린더</span>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400">
        {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = formatDate(day);
          const badges = badgeMap[key] ?? [];
          const isCurrentMonth = day.getMonth() === currentMonth;

          return (
            <div
              key={key}
              className={`min-h-[92px] rounded-2xl border p-2 ${
                isCurrentMonth ? "border-slate-100 bg-slate-50" : "border-transparent bg-slate-50/50"
              }`}
            >
              <div className={`text-xs font-semibold ${isCurrentMonth ? "text-slate-700" : "text-slate-300"}`}>
                {day.getDate()}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {badges.map((badge) => (
                  <span
                    key={`${key}-${badge}`}
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${BADGE_STYLES[badge] ?? BADGE_STYLES.휴무}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [className, setClassName] = useState("");
  const [selectedDays, setSelectedDays] = useState([1, 3]);
  const [startDate, setStartDate] = useState("");
  const [targetCount, setTargetCount] = useState(8);
  const [holidayInput, setHolidayInput] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [tone, setTone] = useState("formal");
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);

  useEffect(() => {
    initGA();
    initClarity();
    window.onerror = (message, source, lineno) => {
  sendTelegramAlert(`오류: ${message}\n위치: ${source} ${lineno}번째 줄`);
  setErrorPopup(true);
  return false;
};
window.onunhandledrejection = (event) => {
  sendTelegramAlert(`처리 안 된 오류: ${event.reason}`);
  setErrorPopup(true);
};
  }, []);

  const sortedHolidays = useMemo(
    () => [...holidays].sort((a, b) => parseDate(a) - parseDate(b)),
    [holidays]
  );

  const is2026Start = startDate ? startDate.startsWith("2026-") : true;

  const mergedHolidayInfo = useMemo(() => {
    const map = new Map();

    if (is2026Start) {
      KOREAN_HOLIDAYS_2026.forEach((holiday) => {
        map.set(holiday.date, { date: holiday.date, name: holiday.name, source: "auto" });
      });
    }

    sortedHolidays.forEach((date) => {
      if (!map.has(date)) {
        map.set(date, { date, name: "학원 자체 휴무", source: "manual" });
      }
    });

    return map;
  }, [is2026Start, sortedHolidays]);

  const selectedDayLabels = useMemo(
    () => WEEK_DAYS.filter((day) => selectedDays.includes(day.value)).map((day) => day.label),
    [selectedDays]
  );

  const calendarAssistantData = useMemo(() => {
    if (!result) return null;
    return {
      className: className.trim(),
      startDate,
      lastClassDate: formatDate(result.lastClassDate),
      targetCount: String(result.totalCount),
      classDays: selectedDayLabels.join(", "),
      holidays: result.missedDates.length
        ? result.missedDates.map((item) => formatMissedDateItem(item)).join(", ")
        : "",
    };
  }, [className, result, selectedDayLabels, startDate]);

  const toggleDay = (value, setter, current) => {
    setter(current.includes(value) ? current.filter((day) => day !== value) : [...current, value].sort((a, b) => a - b));
  };

  const addHoliday = () => {
    if (!holidayInput) return;
    if (holidays.includes(holidayInput)) {
      setHolidayInput("");
      return;
    }
    setHolidays([...holidays, holidayInput]);
    setHolidayInput("");
  };

  const removeHoliday = (value) => {
    setHolidays(holidays.filter((holiday) => holiday !== value));
  };

  const validate = () => {
    const nextErrors = [];
    if (!className.trim()) nextErrors.push("반 이름을 입력해 주세요.");
    if (!selectedDays.length) nextErrors.push("수업 요일을 1개 이상 선택해 주세요.");
    if (!startDate) nextErrors.push("시작일을 선택해 주세요.");
    if (!Number.isFinite(Number(targetCount)) || Number(targetCount) < 1) {
      nextErrors.push("목표 회차는 1 이상으로 입력해 주세요.");
    }
    return nextErrors;
  };

  const calculateSchedule = () => {
    trackEvent("calendar_generate_click", {
      className: className.trim(),
      selectedDays: selectedDayLabels.join(", "),
      targetCount,
    });

    const validationErrors = validate();
    if (validationErrors.length) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    const holidaySet = new Set(mergedHolidayInfo.keys());
    const classDates = [];
    const missedDates = [];
    const start = parseDate(startDate);
    const target = Number(targetCount);

    let cursor = new Date(start);
    let scannedDays = 0;

    while (classDates.length < target && scannedDays < 1460) {
      const iso = formatDate(cursor);

      if (selectedDays.includes(cursor.getDay())) {
        if (holidaySet.has(iso)) {
          const holidayInfo = mergedHolidayInfo.get(iso);
          missedDates.push({
            date: new Date(cursor),
            dateKey: iso,
            name: holidayInfo?.name ?? "학원 자체 휴무",
            source: holidayInfo?.source ?? "manual",
          });
        } else {
          classDates.push(new Date(cursor));
        }
      }

      cursor = addDays(cursor, 1);
      scannedDays += 1;
    }

    if (classDates.length !== target) {
      setErrors(["목표 회차를 채울 수 있는 수업일을 충분히 찾지 못했습니다. 입력값을 확인해 주세요."]);
      setResult(null);
      return;
    }

    const lastClassDate = classDates[classDates.length - 1];
    const allImportantDates = [start, lastClassDate, ...classDates, ...missedDates.map((item) => item.date)].filter(Boolean);
    const uniqueMonthKeys = [...new Set(allImportantDates.map((date) => monthKey(date)))];
    const months = uniqueMonthKeys
      .map((key) => {
        const [year, month] = key.split("-").map(Number);
        return new Date(year, month, 1);
      })
      .sort((a, b) => a - b);

    const badgeMap = {};

    classDates.forEach((date) => {
      const key = formatDate(date);
      badgeMap[key] = [...new Set([...(badgeMap[key] ?? []), "수업"])];
    });

    missedDates.forEach((item) => {
      const label = item.source === "auto" ? "공휴일" : "휴무";
      badgeMap[item.dateKey] = [...new Set([...(badgeMap[item.dateKey] ?? []), label])];
    });

    if (lastClassDate) {
      const key = formatDate(lastClassDate);
      badgeMap[key] = [...new Set([...(badgeMap[key] ?? []), "마지막"])];
    }

    const shortNotice = buildShareSummary(missedDates, classDates.length);
    const message = buildCalendarMessage({
      className: className.trim(),
      missedDates,
      lastClassDate,
      totalCount: classDates.length,
      tone,
      months,
    });

    setErrors([]);
    setCopied(false);
    setResult({
      totalCount: classDates.length,
      classDates,
      missedDates,
      lastClassDate,
      months,
      badgeMap,
      message,
      shortNotice,
      holidayAutoApplied: is2026Start,
    });
  };

  const resetAll = () => {
    setResult(null);
    setErrors([]);
    setCopied(false);
  };

  const copyMessage = async () => {
    if (!result?.message) return;
    trackEvent("copy_basic_notice_click", {
      className: className.trim(),
    });

    try {
      await navigator.clipboard.writeText(result.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      setErrors(["복사에 실패했습니다. 브라우저 권한을 확인해 주세요."]);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === "parentMessage") {
      trackEvent("message_assistant_open");
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900">
      {errorPopup && (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-8">
    <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-xl">
      <div className="text-lg font-bold text-slate-900">앗, 오류가 났어요 😢</div>
      <p className="mt-2 text-sm text-slate-500">불편하셨나요? 어떤 상황이었는지 한 줄만 알려주시면 바로 고칠게요!</p>
      <div className="mt-4 flex gap-3">
        <FeedbackButton analyticsPayload={{ location: "error_popup" }} />
        <button
          type="button"
          onClick={() => setErrorPopup(false)}
          className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-600"
        >
          괜찮아요
        </button>
      </div>
    </div>
  </div>
)}
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-32 pt-6">
        <header className="mb-5">
          <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            공지톡 · 숙제톡 · 리포트
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h1 className="text-[30px] font-black tracking-tight text-slate-900">선생님의 비서</h1>
            <FeedbackButton analyticsPayload={{ location: "header", tab: activeTab }} />
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            선생님이 매일 쓰는 운영 문구를 바로 만들어드려요.
          </p>
        </header>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-[28px] bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <TabButton active={activeTab === "calendar"} onClick={() => handleTabChange("calendar")}>
            보강계산
          </TabButton>
          <TabButton active={activeTab === "notice"} onClick={() => handleTabChange("notice")}>
            공지톡
          </TabButton>
          <TabButton active={activeTab === "parentMessage"} onClick={() => handleTabChange("parentMessage")}>
            숙제톡
          </TabButton>
          <TabButton active={activeTab === "monthlyTips"} onClick={() => handleTabChange("monthlyTips")}>
            리포트
          </TabButton>
        </div>

        {activeTab === "calendar" ? (
          <div className="space-y-4">
            <SectionCard title="기본 정보" description="수업 캘린더를 만들기 위한 핵심 정보를 입력해 주세요.">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">반 이름</span>
                  <input
                    value={className}
                    onChange={(event) => setClassName(event.target.value)}
                    placeholder="예: 화목반"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-slate-900 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">시작일</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-slate-900 focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">목표 회차</span>
                  <input
                    type="number"
                    min="1"
                    value={targetCount}
                    onChange={(event) => setTargetCount(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-slate-900 focus:bg-white"
                  />
                </label>
              </div>
            </SectionCard>

            <SectionCard title="수업 요일" description="정규 수업이 진행되는 요일을 선택해 주세요.">
              <div className="grid grid-cols-4 gap-2">
                {WEEK_DAYS.map((day) => (
                  <ToggleButton
                    key={`class-${day.value}`}
                    active={selectedDays.includes(day.value)}
                    onClick={() => toggleDay(day.value, setSelectedDays, selectedDays)}
                  >
                    {day.label}
                  </ToggleButton>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="휴무일 관리" description="공휴일과 학원 자체 휴무를 함께 반영해 수업 일정을 계산해요.">
              <div className="space-y-4">
                <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-700">
                  2026년 한국 공휴일은 자동으로 반영돼요. 학원 자체 휴무일만 추가해 주세요.
                </div>

                {!is2026Start ? (
                  <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
                    현재 MVP에서는 2026년 공휴일만 자동 반영돼요. 다른 연도의 휴무일은 직접 추가해 주세요.
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={holidayInput}
                    onChange={(event) => setHolidayInput(event.target.value)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-slate-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={addHoliday}
                    className="rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white"
                  >
                    추가
                  </button>
                </div>

                <div className="space-y-2">
                  {sortedHolidays.length ? (
                    sortedHolidays.map((holiday) => (
                      <div
                        key={holiday}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        <span>{formatDisplayDate(holiday)} 학원 자체 휴무</span>
                        <button
                          type="button"
                          onClick={() => removeHoliday(holiday)}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-500"
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-400">
                      등록된 학원 자체 휴무일이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="안내문 톤" description="상황에 맞춰 학부모 안내문 문체를 선택해 주세요.">
              <div className="grid grid-cols-1 gap-2">
                {TONE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTone(option.value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      tone === option.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="text-sm font-semibold">{option.label}</div>
                  </button>
                ))}
              </div>
            </SectionCard>

            {errors.length ? (
              <div className="rounded-[24px] border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
                <div className="font-semibold">입력 내용을 확인해 주세요.</div>
                <ul className="mt-2 space-y-1">
                  {errors.map((error) => (
                    <li key={error}>• {error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {result ? (
              <div className="space-y-4">
                <SectionCard title="계산 결과" description="실제 수업 일정과 마지막 수업일을 한눈에 확인할 수 있어요.">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl bg-slate-900 p-4 text-white">
                      <div className="text-xs text-slate-300">총 수업 회차</div>
                      <div className="mt-2 text-2xl font-black">{result.totalCount}회</div>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-400">마지막 수업일</div>
                      <div className="mt-2 text-base font-bold text-slate-900">
                        {formatDisplayDate(result.lastClassDate)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    {result.holidayAutoApplied
                      ? "2026년 한국 공휴일 자동 반영"
                      : "2026년 공휴일 자동 반영 대상이 아니어서 직접 추가한 휴무일만 반영"}
                  </div>

                  <div className="mt-4 space-y-3">
                    <ResultList
                      title="실제 수업 날짜 목록"
                      items={result.classDates.map((date) => formatDisplayDate(date))}
                      emptyText="수업일이 없습니다."
                    />
                    <ResultList
                      title="휴무로 제외된 날짜 목록"
                      items={result.missedDates.map((item) => formatMissedDateItem(item))}
                      emptyText="휴무로 제외된 날짜가 없습니다."
                    />
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <h3 className="text-sm font-semibold text-slate-800">수업 진행 방식</h3>
                      <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-500">
                        정규 수업일로 목표 회차가 채워져 별도 보강이 필요하지 않아요.
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <section className="space-y-4">
                  {result.months.map((month) => (
                    <CalendarMonth key={monthKey(month)} monthDate={month} badgeMap={result.badgeMap} />
                  ))}
                </section>

                <CalendarShareSection
                  appName="원장님 수업 캘린더"
                  classNameValue={className.trim()}
                  selectedDayLabels={selectedDayLabels}
                  startDate={startDate}
                  targetCount={result.totalCount}
                  months={result.months}
                  lastClassDate={result.lastClassDate}
                  classDates={result.classDates}
                  missedDates={result.missedDates}
                  badgeMap={result.badgeMap}
                  shortNotice={result.shortNotice}
                  formatDisplayDate={formatDisplayDate}
                  formatLongDate={formatLongDate}
                  getMonthLabel={getMonthLabel}
                  createMonthGrid={createMonthGrid}
                  formatDate={formatDate}
                />

                <SectionCard title="학부모 안내문" description="복사해서 바로 보낼 수 있게 자동으로 작성했어요.">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {result.message}
                    </pre>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={copyMessage}
                      className="flex-1 rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white"
                    >
                      안내문 복사
                    </button>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-600"
                    >
                      다시 계산하기
                    </button>
                  </div>

                  {copied ? (
                    <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600">
                      복사 완료!
                    </div>
                  ) : null}

                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    본 도구는 수업 일정 계산을 돕는 참고용 도구입니다. 최종 일정은 원장님께서 확인 후 안내해 주세요.
                    입력한 정보는 별도로 저장되지 않습니다.
                  </p>
                </SectionCard>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === "notice" ? <NoticeAssistant /> : null}

        {activeTab === "parentMessage" ? <ParentMessageAssistant /> : null}

        {activeTab === "monthlyTips" ? (
          <MonthlyTips onGoToHomeworkTalk={() => handleTabChange("parentMessage")} />
        ) : null}

        <footer className="mt-8 pb-4 text-center text-[11px] leading-5 text-slate-400">
          © 2026 선생님의 비서. 기획·제작 Bokyung Ku. All rights reserved.
        </footer>
      </div>

      {activeTab === "calendar" ? (
        <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-md">
            <button
              type="button"
              onClick={calculateSchedule}
              className="w-full rounded-[22px] bg-slate-900 px-5 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition active:scale-[0.99]"
            >
              수업 일정 만들기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;

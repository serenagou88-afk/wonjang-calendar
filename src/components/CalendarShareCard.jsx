import React from "react";

const SHARE_BADGE_STYLES = {
  수업: "bg-sky-100 text-sky-700",
  휴무: "bg-rose-100 text-rose-700",
  공휴일: "bg-rose-100 text-rose-700",
  마지막: "bg-slate-900 text-white",
};

function CalendarShareCard({
  appName,
  classNameValue,
  selectedDayLabels,
  startDate,
  targetCount,
  months,
  lastClassDate,
  missedDates,
  badgeMap,
  shortNotice,
  formatDisplayDate,
  formatLongDate,
  getMonthLabel,
  createMonthGrid,
  formatDate,
}) {
  return (
    <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <div className="bg-slate-900 px-6 py-6 text-white">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">{appName}</div>
        <h3 className="mt-3 text-2xl font-black">{classNameValue}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          {months.length === 1 ? getMonthLabel(months[0]) : `${getMonthLabel(months[0])}부터 ${getMonthLabel(months[months.length - 1])}까지`}
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">수업 요일</div>
            <div className="mt-2 font-semibold text-slate-900">{selectedDayLabels.join(", ")}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">목표 회차</div>
            <div className="mt-2 font-semibold text-slate-900">{targetCount}회</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">시작일</div>
            <div className="mt-2 font-semibold text-slate-900">{formatDisplayDate(startDate)}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs text-slate-400">마지막 수업일</div>
            <div className="mt-2 font-semibold text-slate-900">{formatLongDate(lastClassDate)}</div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">학부모 안내 한 줄</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{shortNotice}</p>
        </div>

        <div className="space-y-4">
          {months.map((month) => {
            const days = createMonthGrid(month);
            const currentMonth = month.getMonth();

            return (
              <div key={`${month.getFullYear()}-${month.getMonth()}`} className="rounded-3xl border border-slate-100 p-4">
                <div className="mb-3 text-base font-bold text-slate-900">{getMonthLabel(month)}</div>
                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400">
                  {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
                    <div key={label}>{label}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const key = formatDate(day);
                    const badges = badgeMap[key] ?? [];
                    const isCurrentMonth = day.getMonth() === currentMonth;

                    return (
                      <div
                        key={key}
                        className={`min-h-[76px] rounded-2xl border p-1.5 ${
                          isCurrentMonth ? "border-slate-100 bg-slate-50" : "border-transparent bg-slate-50/50"
                        }`}
                      >
                        <div className={`text-[11px] font-semibold ${isCurrentMonth ? "text-slate-700" : "text-slate-300"}`}>
                          {day.getDate()}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {badges.map((badge) => (
                            <span
                              key={`${key}-${badge}`}
                              className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${SHARE_BADGE_STYLES[badge] ?? SHARE_BADGE_STYLES.휴무}`}
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
          })}
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">공휴일 및 휴무일</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {missedDates.length ? (
              missedDates.map((item) => (
                <div key={item.dateKey} className="rounded-2xl bg-white px-3 py-2">
                  {formatDisplayDate(item.date)} {item.name}
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-white px-3 py-2 text-slate-400">
                이번 일정에는 별도 휴무일이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarShareCard;

import React, { useMemo, useState } from "react";
import CopyButton from "./CopyButton.jsx";
import FeedbackButton from "./FeedbackButton.jsx";
import {
  DEFAULT_MONTHLY_TIPS_MONTH,
  DEFAULT_MONTHLY_TIPS_SUBJECT,
  MONTHLY_TIP_CATEGORY_ALL,
  getMonthlyTipCategories,
  getMonthlyTips,
} from "../data/monthlyTips/index.js";

function MonthlyTips() {
  const [category, setCategory] = useState(MONTHLY_TIP_CATEGORY_ALL);
  const subject = DEFAULT_MONTHLY_TIPS_SUBJECT;
  const month = DEFAULT_MONTHLY_TIPS_MONTH;
  const categories = useMemo(() => getMonthlyTipCategories({ subject, month }), [subject, month]);
  const filteredTips = useMemo(
    () => getMonthlyTips({ subject, month, category }),
    [category, month, subject]
  );
  const description = `${Number(month.slice(5, 7))}월 영어 공부방 운영에 바로 쓸 수 있는 문구와 액션을 모았어요.`;

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">월간 꿀팁</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                category === item ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {filteredTips.map((tip) => (
        <section key={tip.title} className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="text-xs font-semibold text-slate-400">{tip.category}</div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{tip.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{tip.description}</p>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            {tip.action}
          </div>
          <div className="mt-4 rounded-2xl bg-white text-sm leading-6 text-slate-700">
            {tip.copyText}
          </div>
          <CopyButton text={tip.copyText} className="mt-4" />
        </section>
      ))}

      <FeedbackButton />
    </div>
  );
}

export default MonthlyTips;

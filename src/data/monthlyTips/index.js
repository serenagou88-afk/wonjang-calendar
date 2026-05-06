import englishMonthlyTips202605 from "./english/2026-05.js";

export const DEFAULT_MONTHLY_TIPS_SUBJECT = "english";
export const DEFAULT_MONTHLY_TIPS_MONTH = "2026-05";
export const MONTHLY_TIP_CATEGORY_ALL = "전체";

const monthlyTipsData = {
  english: {
    "2026-05": englishMonthlyTips202605,
  },
  math: {},
  korean: {},
  art: {},
};

export function getMonthlyTips({ subject = DEFAULT_MONTHLY_TIPS_SUBJECT, month = DEFAULT_MONTHLY_TIPS_MONTH, category } = {}) {
  const tips = monthlyTipsData[subject]?.[month] ?? [];

  if (!category || category === MONTHLY_TIP_CATEGORY_ALL) {
    return tips;
  }

  return tips.filter((tip) => tip.category === category);
}

export function getMonthlyTipCategories({ subject = DEFAULT_MONTHLY_TIPS_SUBJECT, month = DEFAULT_MONTHLY_TIPS_MONTH } = {}) {
  const tips = getMonthlyTips({ subject, month });
  const categories = [...new Set(tips.map((tip) => tip.category))];

  return [MONTHLY_TIP_CATEGORY_ALL, ...categories];
}

export function hasMonthlyTips({ subject = DEFAULT_MONTHLY_TIPS_SUBJECT, month = DEFAULT_MONTHLY_TIPS_MONTH } = {}) {
  return getMonthlyTips({ subject, month }).length > 0;
}

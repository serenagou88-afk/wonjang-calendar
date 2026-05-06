import {
  DEFAULT_MONTHLY_TIPS_MONTH,
  DEFAULT_MONTHLY_TIPS_SUBJECT,
  MONTHLY_TIP_CATEGORY_ALL,
  getMonthlyTipCategories,
  getMonthlyTips,
} from "../data/monthlyTips/index.js";

export {
  DEFAULT_MONTHLY_TIPS_MONTH,
  DEFAULT_MONTHLY_TIPS_SUBJECT,
  MONTHLY_TIP_CATEGORY_ALL,
  getMonthlyTipCategories,
  getMonthlyTips,
};

export const MONTHLY_TIP_CATEGORIES = getMonthlyTipCategories();

export const monthlyTipsBySubject = {
  [DEFAULT_MONTHLY_TIPS_SUBJECT]: getMonthlyTips({
    subject: DEFAULT_MONTHLY_TIPS_SUBJECT,
    month: DEFAULT_MONTHLY_TIPS_MONTH,
  }),
};

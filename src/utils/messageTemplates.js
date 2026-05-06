export const MESSAGE_TEMPLATE_OPTIONS = [
  { value: "schedule", label: "기본 수업 일정 안내" },
  { value: "holiday", label: "공휴일/휴강 안내" },
  { value: "makeup", label: "보강 안내" },
  { value: "absence", label: "결석 안내" },
  { value: "homework", label: "숙제 미제출 안내" },
  { value: "tuition", label: "수업료 안내" },
  { value: "book", label: "교재비 안내" },
  { value: "consulting", label: "상담 일정 안내" },
  { value: "praise", label: "칭찬 문자" },
  { value: "attitude", label: "수업 태도 안내" },
];

export const MESSAGE_ASSISTANT_TONES = [
  { value: "warm", label: "따뜻하게" },
  { value: "polite", label: "정중하게" },
  { value: "short", label: "짧고 간단하게" },
  { value: "firmSoft", label: "단호하지만 부드럽게" },
];

const TEMPLATE_FIELDS = {
  schedule: [
    { name: "className", label: "반 이름", type: "text", placeholder: "예: 화목반" },
    { name: "startDate", label: "시작일", type: "date", placeholder: "" },
    { name: "lastClassDate", label: "마지막 수업일", type: "date", placeholder: "" },
    { name: "targetCount", label: "목표 회차", type: "number", placeholder: "예: 8" },
    { name: "classDays", label: "수업 요일", type: "text", placeholder: "예: 화, 목" },
    { name: "holidays", label: "휴무일", type: "textarea", placeholder: "예: 2026. 5. 5 (화) 어린이날" },
  ],
  holiday: [
    { name: "className", label: "반 이름", type: "text", placeholder: "예: 초등 사고력반" },
    { name: "holidayDate", label: "휴강 날짜", type: "date", placeholder: "" },
    { name: "holidayReason", label: "휴강 사유", type: "text", placeholder: "예: 어린이날" },
    { name: "followUp", label: "보강 여부 또는 안내 문구", type: "textarea", placeholder: "예: 이후 정규 수업일에 이어서 진행됩니다." },
  ],
  makeup: [
    { name: "studentOrClass", label: "학생 이름 또는 반 이름", type: "text", placeholder: "예: 민준 / 화목반" },
    { name: "makeupDate", label: "보강 날짜", type: "date", placeholder: "" },
    { name: "makeupTime", label: "보강 시간", type: "text", placeholder: "예: 오후 5시" },
    { name: "makeupReason", label: "보강 사유", type: "text", placeholder: "예: 공휴일 휴강" },
  ],
  absence: [
    { name: "studentName", label: "학생 이름", type: "text", placeholder: "예: 민준" },
    { name: "absenceDate", label: "결석 날짜", type: "date", placeholder: "" },
    { name: "absenceReason", label: "결석 사유", type: "text", placeholder: "예: 개인 사정" },
    { name: "absenceFollowUp", label: "보강 안내 여부", type: "textarea", placeholder: "예: 보강 여부는 추후 안내드리겠습니다." },
  ],
  homework: [
    { name: "studentName", label: "학생 이름", type: "text", placeholder: "예: 민준" },
    { name: "homeworkName", label: "숙제명", type: "text", placeholder: "예: 분수 연산 프린트" },
    { name: "homeworkDueDate", label: "제출기한", type: "date", placeholder: "" },
  ],
  tuition: [
    { name: "studentOrClass", label: "학생 이름 또는 반 이름", type: "text", placeholder: "예: 민준 / 화목반" },
    { name: "amount", label: "금액", type: "text", placeholder: "예: 180000원" },
    { name: "dueDate", label: "납부기한", type: "date", placeholder: "" },
  ],
  book: [
    { name: "studentOrClass", label: "학생 이름 또는 반 이름", type: "text", placeholder: "예: 민준 / 화목반" },
    { name: "bookName", label: "교재명", type: "text", placeholder: "예: 사고력 수학 3단계" },
    { name: "amount", label: "금액", type: "text", placeholder: "예: 25000원" },
  ],
  consulting: [
    { name: "parentName", label: "학부모님 호칭 또는 이름", type: "text", placeholder: "예: 민준 어머님" },
    { name: "consultingDate", label: "상담 날짜", type: "date", placeholder: "" },
    { name: "consultingTime", label: "상담 시간", type: "text", placeholder: "예: 오후 7시" },
    { name: "consultingTopic", label: "상담 내용", type: "textarea", placeholder: "예: 최근 학습 흐름과 학습 습관 점검" },
  ],
  praise: [
    { name: "studentName", label: "학생 이름", type: "text", placeholder: "예: 민준" },
    { name: "lessonContent", label: "수업 내용", type: "text", placeholder: "예: 분수의 덧셈과 뺄셈" },
    { name: "praisePoint", label: "칭찬 포인트", type: "textarea", placeholder: "예: 끝까지 집중해서 스스로 풀이를 완성했어요." },
  ],
  attitude: [
    { name: "studentName", label: "학생 이름", type: "text", placeholder: "예: 민준" },
    { name: "attitudeDetail", label: "수업 중 보인 모습", type: "textarea", placeholder: "예: 설명 중 집중이 자주 흐트러졌어요." },
    { name: "homeRequest", label: "가정 협조 요청", type: "textarea", placeholder: "예: 수업 전 휴대폰 사용을 줄일 수 있도록 도와주세요." },
  ],
};

const formatDateLabel = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${year}년 ${month}월 ${day}일`;
};

const formatMonthDayLabel = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${month}월 ${day}일`;
};

const getToneIntro = (tone, subject) => {
  if (tone === "warm") return `안녕하세요 :) ${subject}`;
  if (tone === "polite") return `안녕하세요. ${subject}`;
  if (tone === "short") return `[안내] ${subject}`;
  return `안녕하세요. ${subject} 꼭 확인 부탁드립니다.`;
};

export const getTemplateFields = (messageType) => TEMPLATE_FIELDS[messageType] ?? [];

export const buildCalendarTemplateValues = (calendarResult) => ({
  className: calendarResult.className ?? "",
  startDate: calendarResult.startDate ?? "",
  lastClassDate: calendarResult.lastClassDate ?? "",
  targetCount: calendarResult.targetCount ?? "",
  classDays: calendarResult.classDays ?? "",
  holidays: calendarResult.holidays ?? "",
});

const createScheduleMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.className || "수업"} 일정 안내드립니다.`);
  const holidays = values.holidays?.trim();
  const body = holidays
    ? `${holidays} 일정은 수업이 진행되지 않으며, 이후 정규 수업일에 이어서 진행됩니다.`
    : "별도 휴무일 없이 정규 수업 일정에 따라 진행됩니다.";
  const detail = [
    values.classDays ? `수업 요일: ${values.classDays}` : "",
    values.startDate ? `시작일: ${formatDateLabel(values.startDate)}` : "",
    values.lastClassDate ? `마지막 수업일: ${formatDateLabel(values.lastClassDate)}` : "",
    values.targetCount ? `총 ${values.targetCount}회 수업으로 운영됩니다.` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return [intro, "", body, detail].filter(Boolean).join("\n");
};

const createHolidayMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.className || "수업"} 휴강 안내드립니다.`);
  const body = `${formatMonthDayLabel(values.holidayDate)} ${values.holidayReason || "휴강 일정"}로 수업이 진행되지 않습니다.`;
  return [intro, "", body, values.followUp].filter(Boolean).join("\n");
};

const createMakeupMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentOrClass || "보강"} 일정 안내드립니다.`);
  const body = `${values.makeupReason || "일정 조정"}으로 ${formatMonthDayLabel(values.makeupDate)} ${values.makeupTime || ""}에 보강 수업이 진행됩니다.`;
  return [intro, "", body.trim()].filter(Boolean).join("\n");
};

const createAbsenceMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentName || "학생"} 결석 관련 안내드립니다.`);
  const body = `${values.studentName || "학생"} 학생이 ${formatMonthDayLabel(values.absenceDate)} 수업에 ${values.absenceReason || "개인 사정"}으로 참여하지 못했습니다.`;
  return [intro, "", body, values.absenceFollowUp].filter(Boolean).join("\n");
};

const createHomeworkMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentName || "학생"} 숙제 안내드립니다.`);
  const body = `${values.homeworkName || "숙제"}가 아직 제출되지 않았습니다. ${formatMonthDayLabel(values.homeworkDueDate)}까지 꼭 제출할 수 있도록 도와주세요.`;
  return [intro, "", body].filter(Boolean).join("\n");
};

const createTuitionMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentOrClass || "수업료"} 안내드립니다.`);
  const body = `${values.amount || "수업료"} 납부 부탁드립니다. 납부기한은 ${formatMonthDayLabel(values.dueDate)}입니다.`;
  return [intro, "", body].filter(Boolean).join("\n");
};

const createBookMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentOrClass || "교재비"} 안내드립니다.`);
  const body = `${values.bookName || "교재"} 교재비는 ${values.amount || "금액"}입니다. 확인 부탁드립니다.`;
  return [intro, "", body].filter(Boolean).join("\n");
};

const createConsultingMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.parentName || "학부모님"} 상담 일정 안내드립니다.`);
  const body = `${formatMonthDayLabel(values.consultingDate)} ${values.consultingTime || ""}에 상담을 진행하고자 합니다.`;
  return [intro, "", body.trim(), values.consultingTopic].filter(Boolean).join("\n");
};

const createPraiseMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentName || "학생"} 수업 칭찬 문자드립니다.`);
  const body = `${values.lessonContent || "오늘 수업"}에서 ${values.praisePoint || "참여 태도가 아주 좋았습니다."}`;
  return [intro, "", body].filter(Boolean).join("\n");
};

const createAttitudeMessage = (tone, values) => {
  const intro = getToneIntro(tone, `${values.studentName || "학생"} 수업 태도 관련 안내드립니다.`);
  return [intro, "", values.attitudeDetail, values.homeRequest].filter(Boolean).join("\n");
};

export const generateMessage = ({ messageType, tone, values }) => {
  if (messageType === "schedule") return createScheduleMessage(tone, values);
  if (messageType === "holiday") return createHolidayMessage(tone, values);
  if (messageType === "makeup") return createMakeupMessage(tone, values);
  if (messageType === "absence") return createAbsenceMessage(tone, values);
  if (messageType === "homework") return createHomeworkMessage(tone, values);
  if (messageType === "tuition") return createTuitionMessage(tone, values);
  if (messageType === "book") return createBookMessage(tone, values);
  if (messageType === "consulting") return createConsultingMessage(tone, values);
  if (messageType === "praise") return createPraiseMessage(tone, values);
  if (messageType === "attitude") return createAttitudeMessage(tone, values);
  return "";
};

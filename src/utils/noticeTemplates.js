export const NOTICE_CONTEXTS = [
  { value: "holiday", label: "휴무 안내" },
  { value: "makeup", label: "보강 안내" },
  { value: "reschedule", label: "수업일 변경" },
  { value: "monthEnd", label: "월말 안내" },
  { value: "test", label: "테스트 안내" },
];

const buildGreeting = (academyName) => {
  const trimmedAcademyName = academyName?.trim();

  if (!trimmedAcademyName) {
    return "안녕하세요.";
  }

  return `안녕하세요. ${trimmedAcademyName}입니다.`;
};

const buildScheduleLabel = (studentName) => {
  const trimmedName = studentName?.trim();

  if (!trimmedName) {
    return "수업 일정";
  }

  if (trimmedName.endsWith("반")) {
    return `${trimmedName} 수업 일정`;
  }

  return `${trimmedName} 학생 수업 일정`;
};

const buildDateTimeLabel = (date, time, fallback) => {
  const trimmedDate = date?.trim();
  const trimmedTime = time?.trim();
  const combined = [trimmedDate, trimmedTime].filter(Boolean).join(" ");

  return combined || fallback;
};

const normalizeReason = (reason) => {
  const trimmedReason = reason?.trim();

  if (!trimmedReason) {
    return "운영 일정 조정";
  }

  const compactReason = trimmedReason.replace(/\s+/g, "");
  const mappedReasons = {
    "어린이날휴무": "어린이날 휴무 일정으로 인한 조정",
    "공휴일": "공휴일 일정으로 인한 조정",
    "개인사정": "개인 일정으로 인한 조정",
  };

  if (mappedReasons[compactReason]) {
    return mappedReasons[compactReason];
  }

  if (trimmedReason.includes("일정으로 인한 조정") || trimmedReason.includes("일정 조정")) {
    return trimmedReason;
  }

  if (trimmedReason.endsWith("휴무")) {
    return `${trimmedReason} 일정으로 인한 조정`;
  }

  if (trimmedReason.endsWith("공휴일")) {
    return `${trimmedReason} 일정으로 인한 조정`;
  }

  return `${trimmedReason}으로 인한 조정`;
};

const templatesBySubject = {
  academy: {
    holiday: ({ academyName, date, time, reason }) =>
      `${buildGreeting(academyName)}\n${date || "해당 날짜"} ${time || ""} 수업은 ${reason || "학원 일정"}으로 쉬어갈 예정입니다.\n이후 수업은 아이들 수업 리듬이 끊기지 않도록 안정적으로 이어가겠습니다. 일정 확인 부탁드립니다. 감사합니다.`,
    makeup: ({ academyName, date, time, reason, studentName }) =>
      `${buildGreeting(academyName)}\n${studentName ? `${studentName} 학생 ` : ""}보강 수업은 ${date || "안내드린 날짜"} ${time || ""}에 진행 예정입니다.\n${reason ? `${reason}으로 조정된 일정이며, ` : ""}기존 수업 흐름이 자연스럽게 이어질 수 있도록 준비해두겠습니다.\n가능하신지 편하게 답 주시면 일정에 맞춰 진행하겠습니다.`,
    reschedule: ({ academyName, studentName, oldDate, oldTime, newDate, newTime, reason }) => {
      const scheduleLabel = buildScheduleLabel(studentName);
      const previousSchedule = buildDateTimeLabel(oldDate, oldTime, "기존 일정 확인 필요");
      const nextSchedule = buildDateTimeLabel(newDate, newTime, "변경 일정 확인 필요");
      const normalizedReason = normalizeReason(reason);

      return `${buildGreeting(academyName)}\n\n${scheduleLabel}이 아래와 같이 조정되어 안내드립니다.\n\n기존 일정: ${previousSchedule}\n변경 일정: ${nextSchedule}\n사유: ${normalizedReason}\n\n아이들이 수업 리듬을 무리 없이 이어갈 수 있도록 조정한 일정입니다.\n확인 부탁드립니다. 감사합니다.`;
    },
    monthEnd: ({ academyName, date }) =>
      `${buildGreeting(academyName)}\n${date || "이번 달"} 수업이 차분히 마무리되어 간단히 안내드립니다.\n아이마다 잡아가고 있는 수업 리듬과 복습 루틴을 다음 달에도 안정적으로 이어가겠습니다. 감사합니다.`,
    test: ({ academyName, date, time, reason }) =>
      `${buildGreeting(academyName)}\n${date || "테스트 일정"} ${time || ""}에 ${reason || "간단한 학습 점검"}이 진행될 예정입니다.\n현재까지의 학습 흐름을 편안하게 살펴보는 자리로 준비하겠습니다.\n준비물과 등원 시간만 가볍게 확인 부탁드립니다.`,
  },
};

export const generateNoticeMessage = ({ subject = "academy", context, values }) => {
  const templates = templatesBySubject[subject] ?? templatesBySubject.academy;
  const template = templates[context] ?? templates.holiday;
  return template(values);
};

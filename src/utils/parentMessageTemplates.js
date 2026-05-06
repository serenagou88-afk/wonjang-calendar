export const PARENT_MESSAGE_CONTEXTS = [
  { value: "homework", label: "숙제 체크" },
  { value: "focus", label: "수업 집중 안내" },
  { value: "absence", label: "출석 리듬 안내" },
  { value: "praise", label: "칭찬 문자" },
  { value: "testResult", label: "테스트 결과 안내" },
  { value: "consulting", label: "상담 유도" },
  { value: "inquiry", label: "등록 문의 답변" },
];

export const PARENT_MESSAGE_TONES = [
  { value: "soft", label: "부드럽게" },
  { value: "firmPolite", label: "단호하지만 정중하게" },
  { value: "warm", label: "따뜻하게" },
  { value: "short", label: "짧고 간단하게" },
];

const buildGreeting = (academyName) => {
  const trimmedAcademyName = academyName?.trim();

  if (!trimmedAcademyName) {
    return "안녕하세요.";
  }

  return `안녕하세요. ${trimmedAcademyName}입니다.`;
};

const getStudentLabel = (studentName) => {
  const trimmedStudentName = studentName?.trim();
  return trimmedStudentName ? `${trimmedStudentName} 학생` : "아이";
};

const normalizeMemo = (memo = "") =>
  memo
    .replace(/[ㅋㅎㅠㅜ]+/g, " ")
    .replace(/[!?~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const hasAnyKeyword = (memo, keywords) => keywords.some((keyword) => memo.includes(keyword));

const buildMemoGuidance = (context, memo = "") => {
  const normalizedMemo = normalizeMemo(memo);

  if (!normalizedMemo) {
    return "";
  }

  if (context === "homework") {
    if (hasAnyKeyword(normalizedMemo, ["단어", "암기", "voca", "vocabulary"])) {
      return "특히 단어 복습은 한 번에 많이 하기보다 짧게라도 꾸준히 이어가면 훨씬 안정적으로 자리잡습니다.";
    }

    if (hasAnyKeyword(normalizedMemo, ["늦", "밀리", "미루", "루틴"])) {
      return "이번 주는 양을 늘리기보다 정해진 분량을 짧게라도 꾸준히 이어가며 복습 루틴을 다시 잡아보려고 합니다.";
    }

    return "가정에서도 하루 5~10분 정도만 함께 살펴봐 주시면 수업 리듬을 한결 안정적으로 이어가는 데 도움이 됩니다.";
  }

  if (context === "focus") {
    if (hasAnyKeyword(normalizedMemo, ["피곤", "졸", "컨디션"])) {
      return "컨디션이 조금 가벼워지면 다시 자기 흐름을 찾는 편이라 다음 수업에서는 더 편안하게 이어갈 수 있도록 보겠습니다.";
    }

    if (hasAnyKeyword(normalizedMemo, ["산만", "집중", "흔들"])) {
      return "처음 몇 분만 차분히 리듬을 잡아주면 이후에는 조금 더 안정적으로 따라오는 모습이 있어 그 흐름을 이어가 보겠습니다.";
    }

    return "수업 전 호흡을 조금 가다듬고 들어오면 아이가 수업 흐름에 더 편안하게 적응하는 데 도움이 됩니다.";
  }

  if (context === "absence") {
    if (hasAnyKeyword(normalizedMemo, ["결석", "빠지", "못 왔", "바빠"])) {
      return "무리해서 진도를 맞추기보다 복습 루틴부터 다시 연결해 아이가 부담 없이 흐름을 이어갈 수 있도록 하겠습니다.";
    }

    return "다음 수업에서는 익숙한 내용부터 다시 연결해 학습 흐름을 자연스럽게 이어가겠습니다.";
  }

  if (context === "praise") {
    if (hasAnyKeyword(normalizedMemo, ["발표", "말하기", "읽기"])) {
      return "특히 말하기와 읽기에서 자신 있게 반응해 주는 모습이 좋아서 그 흐름을 잘 살려가 보려고 합니다.";
    }

    return "작은 성취가 쌓이면서 수업 리듬도 한층 안정적으로 자리잡는 중입니다.";
  }

  if (context === "testResult") {
    if (hasAnyKeyword(normalizedMemo, ["단어", "어휘"])) {
      return "단어 쪽은 복습 루틴을 조금만 더 꾸준히 이어가면 한결 편안하게 자리잡을 수 있을 것 같습니다.";
    }

    if (hasAnyKeyword(normalizedMemo, ["읽기", "독해"])) {
      return "읽기 흐름은 서두르기보다 익숙한 문장부터 차근차근 반복하면서 안정적으로 이어가 보겠습니다.";
    }

    return "다음 수업에서는 잘하고 있는 부분은 살리고, 조금씩 잡아가면 좋은 부분은 부담 없이 이어서 다뤄보겠습니다.";
  }

  if (context === "consulting") {
    return "짧게 방향을 맞춰보면 아이에게 맞는 수업 리듬을 더 안정적으로 이어가는 데 도움이 될 것 같습니다.";
  }

  if (context === "inquiry") {
    if (hasAnyKeyword(normalizedMemo, ["초등", "중등", "학년"])) {
      return "아이의 학년과 현재 영어 흐름에 맞춰 너무 무리하지 않는 시작 방향으로 안내드리겠습니다.";
    }

    return "아이 성향과 현재 수준을 함께 살펴보며 편안하게 시작하실 수 있도록 안내드리겠습니다.";
  }

  return "";
};

const buildClosingByTone = (tone, fallback) => {
  if (tone === "short") {
    return "편하실 때 함께 살펴봐 주시면 감사하겠습니다.";
  }

  if (tone === "warm") {
    return fallback || "가정에서도 짧게라도 함께 이어가 주시면 수업 흐름을 더 편안하게 잡아갈 수 있겠습니다.";
  }

  if (tone === "firmPolite") {
    return fallback || "가정에서도 짧게라도 꾸준히 이어주시면 수업 리듬을 안정적으로 맞춰가는 데 도움이 됩니다.";
  }

  return fallback || "가정에서도 짧게라도 꾸준히 이어주시면 수업 리듬을 안정적으로 이어가는 데 도움이 됩니다.";
};

const templatesBySubject = {
  english: {
    homework: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("homework", memo) ||
        "이번 주는 양을 많이 늘리기보다 정해진 분량을 짧게라도 꾸준히 이어가는 데 집중해보려고 합니다.";

      return `${buildGreeting(academyName)}\n\n${studentLabel} 숙제 흐름을 살펴보니 최근 복습 루틴이 조금 느슨해진 모습이 있어 짧게 안내드립니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "가정에서도 하루 5~10분 정도만 복습 흐름을 함께 챙겨주시면 수업 리듬을 더 안정적으로 이어가는 데 도움이 될 것 같습니다."
      )}`;
    },
    focus: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("focus", memo) ||
        "처음 몇 분 동안만 차분히 흐름을 잡아주면 이후에는 자기 리듬을 찾아가는 편이라 다음 수업에서도 편안하게 이어가 보겠습니다.";

      return `${buildGreeting(academyName)}\n\n오늘 ${studentLabel} 수업에서는 초반에 수업 리듬에 들어오는 데 시간이 조금 필요했습니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "수업 전 컨디션을 가볍게 정리하고 들어오면 아이가 수업 흐름을 한결 안정적으로 이어가는 데 도움이 됩니다."
      )}`;
    },
    absence: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("absence", memo) ||
        "다음 수업에서는 익숙한 내용부터 다시 연결해 아이가 부담 없이 수업 리듬을 이어갈 수 있도록 하겠습니다.";

      return `${buildGreeting(academyName)}\n\n${studentLabel} 최근 수업 참여 흐름을 보며 학습 리듬을 다시 자연스럽게 이어갈 방법을 함께 살펴보고 있습니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "가능한 일정 안에서 복습 루틴부터 차분히 다시 연결해 안정적으로 이어가겠습니다."
      )}`;
    },
    praise: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("praise", memo) ||
        "작은 성취가 차곡차곡 쌓이면서 아이 스스로도 수업 흐름에 더 편안하게 올라오는 모습이 보입니다.";

      return `${buildGreeting(academyName)}\n\n오늘 ${studentLabel} 수업에서 참 좋은 흐름을 보여주어 함께 나누고 싶었습니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "이런 좋은 흐름이 이어질 수 있도록 수업에서도 아이의 자신감을 자연스럽게 살려가겠습니다."
      )}`;
    },
    testResult: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("testResult", memo) ||
        "이번 점검에서는 잘하고 있는 부분이 분명히 보였고, 조금씩 잡아가면 좋은 부분도 함께 확인할 수 있었습니다.";

      return `${buildGreeting(academyName)}\n\n${studentLabel} 이번 점검 내용을 간단히 안내드립니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "다음 수업에서는 강점은 살리고 필요한 부분은 복습 루틴 안에서 자연스럽게 이어가겠습니다."
      )}`;
    },
    consulting: ({ studentName, academyName, memo }, tone) => {
      const studentLabel = getStudentLabel(studentName);
      const memoGuidance =
        buildMemoGuidance("consulting", memo) ||
        "최근 수업 흐름을 기준으로 지금 시점에 한 번 짧게 방향을 맞춰보면 아이에게 더 잘 맞는 학습 리듬을 잡아가기 좋겠습니다.";

      return `${buildGreeting(academyName)}\n\n${studentLabel} 최근 학습 흐름과 수업 리듬에 대해 짧게 나누면 좋을 것 같아 연락드립니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "편하신 시간 알려주시면 맞춰서 부담 없이 말씀드리겠습니다."
      )}`;
    },
    inquiry: ({ academyName, memo }, tone) => {
      const memoGuidance =
        buildMemoGuidance("inquiry", memo) ||
        "아이 성향과 현재 영어 흐름을 함께 살펴보며 무리하지 않는 시작 방향으로 안내드리겠습니다.";

      return `${buildGreeting(academyName)}\n\n문의 주셔서 감사합니다.\n\n${memoGuidance}\n\n${buildClosingByTone(
        tone,
        "수업 방식과 가능한 시간대도 함께 편하게 안내드릴 수 있으니 괜찮으신 상담 시간을 알려주시면 맞춰 연락드리겠습니다."
      )}`;
    },
  },
};

export const generateParentMessage = ({ subject = "english", context, tone, values }) => {
  const templates = templatesBySubject[subject] ?? templatesBySubject.english;
  const template = templates[context] ?? templates.homework;
  return template(values, tone);
};

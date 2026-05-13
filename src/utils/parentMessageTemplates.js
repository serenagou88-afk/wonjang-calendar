export const PARENT_MESSAGE_CONTEXTS = [
  { value: "homework", label: "오늘 숙제톡" },
  { value: "focus", label: "숙제 미완료 안내" },
  { value: "absence", label: "복습 안내" },
  { value: "praise", label: "칭찬 숙제톡" },
  { value: "testResult", label: "테스트 안내" },
  { value: "consulting", label: "상담 전 안내" },
  { value: "inquiry", label: "결석 보강 숙제" },
];

export const PARENT_MESSAGE_TONES = [
  { value: "soft", label: "부드럽게" },
  { value: "firmPolite", label: "단호하지만 정중하게" },
  { value: "warm", label: "따뜻하게" },
  { value: "short", label: "짧고 간단하게" },
];

const hasBatchim = (str) => {
  if (!str) return false;
  const last = str[str.length - 1];
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
};

const getStudentLabel = (studentName) => {
  const trimmed = studentName?.trim();
  return trimmed || "우리 아이";
};

const buildSubjectName = (studentLabel) =>
  hasBatchim(studentLabel) ? `${studentLabel}이는` : `${studentLabel}는`;

const buildAffectionateName = (studentLabel) =>
  hasBatchim(studentLabel) ? `${studentLabel}이` : studentLabel;

const ACADEMY_GREETING = (academyName) => `안녕하세요, ${academyName}입니다 😊`;

const SOFT_DEFAULT_GREETING = "안녕하세요 😊";
const FIRM_DEFAULT_GREETING = "안녕하세요.";
const WARM_DEFAULT_GREETING = "안녕하세요 😊🌟";

const buildSoftMessage = (values) => {
  const studentLabel = getStudentLabel(values.studentName);
  const subjectName = buildSubjectName(studentLabel);
  const academy = values.academyName?.trim();
  const progress = values.todayProgress?.trim();
  const learning = values.todayLearning?.trim();
  const basic = values.basicHomework?.trim();
  const extra = values.extraHomework?.trim();
  const memo = values.comment?.trim();

  const lines = [];
  lines.push(academy ? ACADEMY_GREETING(academy) : SOFT_DEFAULT_GREETING);

  if (progress) {
    lines.push(`오늘 ${subjectName} ${progress} 했어요.`);
  }
  if (learning) {
    lines.push(`특히 ${learning} 중심으로 연습했어요.`);
  }
  if (basic) {
    lines.push(`숙제는 ${basic}입니다.`);
  }
  if (extra) {
    lines.push(`추가로 ${extra}도 부탁드려요.`);
  }
  if (memo) {
    lines.push(memo);
  }
  lines.push("가능하면 짧게 한 번만 같이 들어봐 주세요~");

  return lines.join("\n");
};

const buildFirmPoliteMessage = (values) => {
  const academy = values.academyName?.trim();
  const progress = values.todayProgress?.trim();
  const learning = values.todayLearning?.trim();
  const basic = values.basicHomework?.trim();
  const extra = values.extraHomework?.trim();
  const memo = values.comment?.trim();

  const lines = [];
  lines.push(academy ? ACADEMY_GREETING(academy) : FIRM_DEFAULT_GREETING);

  if (progress) {
    lines.push(`오늘 ${progress} 수업했습니다.`);
  }
  if (learning) {
    lines.push(`주요 내용: ${learning}`);
  }
  if (basic) {
    lines.push(`숙제: ${basic}`);
  }
  if (extra) {
    lines.push(`추가: ${extra}`);
  }
  if (memo) {
    lines.push(memo);
  }
  lines.push("다음 수업 흐름을 위해 꼭 확인 부탁드립니다.");

  return lines.join("\n");
};

const buildWarmMessage = (values) => {
  const studentLabel = getStudentLabel(values.studentName);
  const affectionate = buildAffectionateName(studentLabel);
  const academy = values.academyName?.trim();
  const progress = values.todayProgress?.trim();
  const learning = values.todayLearning?.trim();
  const basic = values.basicHomework?.trim();
  const extra = values.extraHomework?.trim();
  const memo = values.comment?.trim();

  const lines = [];
  lines.push(academy ? ACADEMY_GREETING(academy) : WARM_DEFAULT_GREETING);

  if (progress) {
    lines.push(`오늘 ${affectionate} ${progress} 정말 잘 따라왔어요!`);
  }
  if (learning) {
    lines.push(`특히 ${learning} 부분을 즐겁게 익혔어요.`);
  }
  if (memo) {
    lines.push(memo);
  }
  if (basic) {
    lines.push(
      `숙제는 ${basic}인데, 칭찬 한 마디와 함께 같이 들어봐 주시면 더 좋을 것 같아요 ☺️`
    );
  }
  if (extra) {
    lines.push(`추가로 ${extra}도 함께 챙겨주시면 좋아요 ☺️`);
  }

  return lines.join("\n");
};

const buildShortMessage = (values) => {
  const academy = values.academyName?.trim();
  const progress = values.todayProgress?.trim();
  const learning = values.todayLearning?.trim();
  const basic = values.basicHomework?.trim();
  const extra = values.extraHomework?.trim();
  const memo = values.comment?.trim();

  const lines = [];

  if (academy) {
    lines.push(ACADEMY_GREETING(academy));
  }
  if (progress) {
    lines.push(`진도: ${progress}`);
  }
  if (learning) {
    lines.push(`내용: ${learning}`);
  }
  if (basic) {
    lines.push(`숙제: ${basic}`);
  }
  if (extra) {
    lines.push(`추가: ${extra}`);
  }
  if (memo) {
    lines.push(`메모: ${memo}`);
  }

  return lines.join("\n");
};

const builderByTone = {
  soft: buildSoftMessage,
  firmPolite: buildFirmPoliteMessage,
  warm: buildWarmMessage,
  short: buildShortMessage,
};

export const generateParentMessage = ({ subject = "english", context, tone, values }) => {
  void subject;
  void context;
  const builder = builderByTone[tone] ?? buildSoftMessage;
  return builder(values);
};

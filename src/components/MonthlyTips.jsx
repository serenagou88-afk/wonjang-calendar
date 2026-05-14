import React, { useEffect, useMemo, useState } from "react";
import CopyButton from "./CopyButton.jsx";

const STORAGE_KEY_STUDENT = "teacher_report_student";

const REPORT_PERIODS = [
  { value: "2주", label: "2주" },
  { value: "1개월", label: "1개월" },
  { value: "학기", label: "학기" },
];

const REPORT_TONES = [
  { value: "warm", label: "따뜻하게" },
  { value: "professional", label: "전문적으로" },
  { value: "simple", label: "간단하게" },
];

const INITIAL_VALUES = {
  studentName: "",
  period: "2주",
  progress: "",
  strengths: "",
  weakness: "",
  homeReview: "",
};

const hasBatchim = (str) => {
  if (!str) return false;
  const last = str[str.length - 1];
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
};

const eulReul = (str) => (hasBatchim(str) ? "을" : "를");

const getStudentLabel = (name) => (name?.trim() ? name.trim() : "우리 아이");

const buildStudentPossessive = (label) =>
  hasBatchim(label) ? `${label}이의` : `${label}의`;

const buildStudentSubjectGa = (label) =>
  hasBatchim(label) ? `${label}이가` : `${label}가`;

const buildStudentSubjectNeun = (label) =>
  hasBatchim(label) ? `${label}이는` : `${label}는`;

const buildWarmReport = (values) => {
  const student = getStudentLabel(values.studentName);
  const studentPossessive = buildStudentPossessive(student);
  const studentSubjectGa = buildStudentSubjectGa(student);
  const period = values.period;
  const progress = values.progress?.trim();
  const strengths = values.strengths?.trim();
  const weakness = values.weakness?.trim();
  const homeReview = values.homeReview?.trim();

  const blocks = [];
  blocks.push("안녕하세요 😊");
  blocks.push(`지난 ${period} 동안 ${studentPossessive} 학습 리포트를 전해드려요.`);

  const middleLines = [];
  if (progress) {
    middleLines.push(`이번 기간에는 ${progress}${eulReul(progress)} 학습했어요.`);
  }
  if (strengths) {
    middleLines.push(
      `${strengths}${eulReul(strengths)} 정말 잘 따라와 줘서 칭찬을 많이 해줬답니다 🌟`
    );
  }
  if (middleLines.length) {
    blocks.push(middleLines.join("\n"));
  }

  if (weakness) {
    blocks.push(`${weakness} 부분은 앞으로 조금씩 더 익숙해질 수 있도록 도와볼게요.`);
  }

  if (homeReview) {
    blocks.push(
      `집에서는 ${homeReview},\n${studentSubjectGa} 더 자신 있게 발화할 수 있을 거예요.`
    );
  }

  blocks.push(
    `앞으로도 ${studentSubjectGa} 즐겁게 영어를 배울 수 있도록 함께하겠습니다 😊`
  );

  return blocks.join("\n\n");
};

const buildProfessionalReport = (values) => {
  const student = getStudentLabel(values.studentName);
  const studentSubjectNeun = buildStudentSubjectNeun(student);
  const period = values.period;
  const progress = values.progress?.trim();
  const strengths = values.strengths?.trim();
  const weakness = values.weakness?.trim();
  const homeReview = values.homeReview?.trim();

  const blocks = [];
  blocks.push(`[${period} 학습 리포트] ${student}`);

  const stats = [];
  if (progress) stats.push(`학습 진도: ${progress}`);
  if (strengths) stats.push(`성취 영역: ${strengths}`);
  if (stats.length) blocks.push(stats.join("\n"));

  if (strengths) {
    blocks.push(
      `이번 기간 동안 ${studentSubjectNeun} ${strengths} 영역에서 안정적인 모습을 보였습니다.`
    );
  }

  if (weakness) {
    blocks.push(`보완 영역: ${weakness}`);
  }

  if (homeReview) {
    blocks.push(`가정 연계: ${homeReview} 활동을 권장드립니다.`);
  }

  return blocks.join("\n\n");
};

const buildSimpleReport = (values) => {
  const student = getStudentLabel(values.studentName);
  const period = values.period;
  const progress = values.progress?.trim();
  const strengths = values.strengths?.trim();
  const weakness = values.weakness?.trim();
  const homeReview = values.homeReview?.trim();

  const lines = [`[${student} / ${period} 리포트]`, ""];

  if (progress) lines.push(`진도: ${progress}`);
  if (strengths) lines.push(`잘한 점: ${strengths}`);
  if (weakness) lines.push(`보완: ${weakness}`);
  if (homeReview) lines.push(`가정: ${homeReview}`);

  return lines.join("\n");
};

const generateReport = ({ tone, values }) => {
  if (tone === "professional") return buildProfessionalReport(values);
  if (tone === "simple") return buildSimpleReport(values);
  return buildWarmReport(values);
};

function MonthlyTips({ onGoToHomeworkTalk }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [tone, setTone] = useState(REPORT_TONES[0].value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_STUDENT) ?? "";
      if (saved) {
        setValues((current) => ({ ...current, studentName: saved }));
      }
    } catch (error) {
      // localStorage 접근 실패 시 조용히 무시
    }
  }, []);

  const updateValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleStudentBlur = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY_STUDENT, values.studentName ?? "");
    } catch (error) {
      // 저장 실패는 조용히 무시
    }
  };

  const livePreview = useMemo(() => generateReport({ tone, values }), [tone, values]);

  const hasMeaningfulContent =
    values.progress.trim() !== "" ||
    values.strengths.trim() !== "" ||
    values.weakness.trim() !== "" ||
    values.homeReview.trim() !== "";

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] bg-sky-50 px-5 py-4">
        <p className="text-sm leading-6 text-sky-800">
          💡 정식 버전에서는 숙제톡 기록이 자동으로 모여 리포트가 만들어집니다. 지금은 직접 입력해서 미리 체험해보세요.
        </p>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-bold text-slate-900">리포트</h2>
        <p className="mt-1 text-sm text-slate-500">학생별 학습 리포트를 톤별로 만들어 보세요.</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {REPORT_TONES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setTone(item.value)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                tone === item.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">학생 이름</span>
            <input
              value={values.studentName}
              onChange={(event) => updateValue("studentName", event.target.value)}
              onBlur={handleStudentBlur}
              placeholder="예: 민준"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>

          <div className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">리포트 기간</span>
            <div className="grid grid-cols-3 gap-2">
              {REPORT_PERIODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateValue("period", item.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    values.period === item.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">학습 진도</span>
            <input
              value={values.progress}
              onChange={(event) => updateValue("progress", event.target.value)}
              placeholder="예: Phonics Unit 3~4"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">잘한 점</span>
            <input
              value={values.strengths}
              onChange={(event) => updateValue("strengths", event.target.value)}
              placeholder="예: short a 소리 구분"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">보완할 점</span>
            <input
              value={values.weakness}
              onChange={(event) => updateValue("weakness", event.target.value)}
              placeholder="예: 단어 발화 자신감 (비워두면 생략돼요)"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">가정 복습 안내</span>
            <textarea
              value={values.homeReview}
              onChange={(event) => updateValue("homeReview", event.target.value)}
              rows={3}
              placeholder="예: 오늘 배운 단어를 1일 1회 음독 (비워두면 생략돼요)"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none focus:border-slate-900 focus:bg-white"
            />
          </label>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        {hasMeaningfulContent ? (
          <>
            <textarea
              value={livePreview}
              readOnly
              className="min-h-[260px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 outline-none focus:border-slate-900 focus:bg-white"
            />
            <CopyButton
              text={livePreview}
              className="mt-4"
              analyticsEventName="monthly_tip_copied"
              analyticsPayload={{
                tab: "monthlyTips",
                tone,
                period: values.period,
              }}
            />
          </>
        ) : (
          <div className="rounded-3xl bg-slate-50 px-4 py-10 text-center text-sm leading-6 text-slate-400">
            위 항목을 입력하면 리포트가 완성돼요.
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={() => {
          if (typeof onGoToHomeworkTalk === "function") onGoToHomeworkTalk();
        }}
        className="block w-full rounded-[28px] bg-amber-50 px-5 py-4 text-left"
      >
        <p className="text-sm leading-6 text-amber-900">
          📌 매일 숙제톡을 쓰면 리포트가 자동으로 채워집니다.
        </p>
        <p className="mt-1 text-sm leading-6 text-amber-900">
          숙제톡 탭에서 먼저 기록을 시작해보세요.
        </p>
      </button>
    </div>
  );
}

export default MonthlyTips;

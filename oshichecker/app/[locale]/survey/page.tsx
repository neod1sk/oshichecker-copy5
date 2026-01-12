import { Suspense } from "react";
import { Locale } from "@/i18n.config";
import { getDictionary } from "@/lib/i18n";
import { Question, Member } from "@/lib/types";
import SurveyClient from "@/components/survey/SurveyClient";

import questionsData from "@/data/questions.json";
import membersData from "@/data/members.json";

interface SurveyPageProps {
  params: { locale: Locale };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { locale } = params;
  await getDictionary(locale); // dict を使ってないなら無くてもOK（あるならそのまま）

  const questions = questionsData as Question[];
  const members = membersData as Member[];

  return (
    <Suspense
      fallback={
        <div className="p-4 text-sm text-gray-500">
          {locale === "ko" ? "로딩 중..." : locale === "en" ? "Loading..." : "読み込み中..."}
        </div>
      }
    >
      <SurveyClient
        questions={questions}
        members={members}
        locale={locale}
        dict={{
          loading: locale === "ko" ? "로딩 중..." : locale === "en" ? "Loading..." : "読み込み中...",
          calculating:
            locale === "ko"
              ? "당신의 최애를 찾고 있습니다..."
              : locale === "en"
              ? "Finding your perfect match..."
              : "あなたの推しを探しています...",
        }}
      />
    </Suspense>
  );
}

"use client";

import { useState, RefObject } from "react";
import { CandidateMember, Group } from "@/lib/types";
import { Locale } from "@/i18n.config";
import { getLocalizedName } from "@/lib/utils";

interface ShareButtonsProps {
  topMembers: CandidateMember[];
  groups: Group[];
  locale: Locale;
  resultCardRef: RefObject<HTMLDivElement | null>;
  dict: {
    shareX: string;
    saveImage: string;
  };
}

// サイトURL（本番環境では環境変数から取得）
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oshichecker.example.com";

export default function ShareButtons({
  topMembers,
  groups,
  locale,
  resultCardRef,
  dict,
}: ShareButtonsProps) {
  const [isSaving, setIsSaving] = useState(false);

  // グループ名を取得するヘルパー
  const getGroupName = (groupId: string): string => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return "";
    return getLocalizedName(group, locale);
  };

  // シェアテキストを生成
  const generateShareText = (): string => {
    const intro = locale === "ko"
      ? "오시체커로 진단했더니..."
      : locale === "en"
      ? "My Oshi Checker results..."
      : "推しチェッカーで診断したら…";

    const rankEmojis = ["👑", "🥈", "🥉"];
    const rankLabels = locale === "ko"
      ? ["1위", "2위", "3위"]
      : locale === "en"
      ? ["1st", "2nd", "3rd"]
      : ["1位", "2位", "3位"];

    const results = topMembers
      .slice(0, 3)
      .map((candidate, index) => {
        const memberName = getLocalizedName(candidate.member, locale);
        const groupName = getGroupName(candidate.member.groupId);
        return `${rankEmojis[index]} ${rankLabels[index]}: ${memberName}${groupName ? `（${groupName}）` : ""}`;
      })
      .join("\n");

    const hashtags = locale === "ko"
      ? "#오시체커 #한국인디아이돌 #최애진단"
      : locale === "en"
      ? "#OshiChecker #KUndergroundIdol #BiasDiagnosis"
      : "#推しチェッカー #韓国地下アイドル #推し診断";

    return `${intro}\n\n${results}\n\n${hashtags}\n${SITE_URL}`;
  };

  // Xでシェア
  const handleShareX = () => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  // 画像を保存（動的インポート）
  const handleSaveImage = async () => {
    if (!resultCardRef.current || isSaving) return;

    setIsSaving(true);

    try {
      // html-to-imageを動的にインポート
      const { toPng } = await import("html-to-image");
      
      // html-to-imageで画像生成
      const dataUrl = await toPng(resultCardRef.current, {
        quality: 0.95,
        pixelRatio: 2, // 高解像度
        backgroundColor: "#fdf2f8", // 背景色
      });

      // ダウンロードリンクを作成
      const link = document.createElement("a");
      link.download = `oshi-checker-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to save image:", error);
      // ライブラリがインストールされていない場合のエラーメッセージ
      const errorMessage = locale === "ko"
        ? "이미지 저장 기능을 사용하려면 라이브러리 설치가 필요합니다."
        : locale === "en"
        ? "Library installation required for image saving feature."
        : "画像保存機能を使用するにはライブラリのインストールが必要です。\n\ncd oshichecker\nnpm install html-to-image";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {/* Xでシェアボタン */}
      <button
        onClick={handleShareX}
        className="w-full py-3 px-4 rounded-xl font-medium text-white
          bg-black hover:bg-gray-800 active:bg-gray-900
          transition-colors duration-200
          flex items-center justify-center gap-2 shadow-md"
      >
        {/* X (Twitter) アイコン */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>{dict.shareX}</span>
      </button>

      {/* 画像保存ボタン */}
      <button
        onClick={handleSaveImage}
        disabled={isSaving}
        className="w-full py-3 px-4 rounded-xl font-medium
          bg-gradient-to-r from-pink-100 to-orange-100
          hover:from-pink-200 hover:to-orange-200
          active:from-pink-300 active:to-orange-300
          text-gray-700 transition-all duration-200
          flex items-center justify-center gap-2 shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>
              {locale === "ko" ? "저장 중..." : locale === "en" ? "Saving..." : "保存中..."}
            </span>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dict.saveImage}</span>
          </>
        )}
      </button>
    </div>
  );
}

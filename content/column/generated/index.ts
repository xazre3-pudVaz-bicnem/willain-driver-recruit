import type { ColumnArticle } from "@/lib/column";

// 自動生成コラムのバレル。generate-column が管理します（手動編集しない）。
import { article as article_funabashiDeliveryGuide } from "./funabashi-delivery-guide";
import { article as article_shinagawaDeliveryGuide } from "./shinagawa-delivery-guide";

export const generatedColumnArticles: ColumnArticle[] = [
  article_funabashiDeliveryGuide,
  article_shinagawaDeliveryGuide,
];

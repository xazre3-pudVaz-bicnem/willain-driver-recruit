import type { ColumnArticle } from "@/lib/column";

// 自動生成コラムのバレル。generate-column が管理します（手動編集しない）。
import { article as article_deliveryAppBasics } from "./delivery-app-basics";
import { article as article_funabashiDeliveryGuide } from "./funabashi-delivery-guide";
import { article as article_rideAlongTraining } from "./ride-along-training";
import { article as article_shinagawaDeliveryGuide } from "./shinagawa-delivery-guide";

export const generatedColumnArticles: ColumnArticle[] = [
  article_deliveryAppBasics,
  article_funabashiDeliveryGuide,
  article_rideAlongTraining,
  article_shinagawaDeliveryGuide,
];

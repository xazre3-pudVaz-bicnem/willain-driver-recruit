import type { ColumnArticle } from "@/lib/column";

import { article as whatIsLightCargoDriver } from "./what-is-light-cargo-driver";
import { article as gyomuItakuBasics } from "./gyomu-itaku-basics";
import { article as startFromBeginner } from "./start-from-beginner";
import { article as licenseRequirements } from "./license-requirements";
import { article as vehicleLeaseVsOwn } from "./vehicle-lease-vs-own";
import { article as dailyGuaranteeVsPiecework } from "./daily-guarantee-vs-piecework";
import { article as driverDailySchedule } from "./driver-daily-schedule";
import { article as weeklyPaymentJobs } from "./weekly-payment-jobs";
import { article as tokyoDriverChecklist } from "./tokyo-driver-checklist";
import { article as taxReturnBasics } from "./tax-return-basics";
import { article as independenceGuide } from "./independence-guide";
import { article as interviewChecklist } from "./interview-checklist";
// 新規（2026-07-28・第1弾）
import { article as tokyoJobComparison } from "./tokyo-job-comparison";
import { article as blackNumberBasics } from "./black-number-basics";
import { article as takeHomeAndExpenses } from "./take-home-and-expenses";
import { article as insuranceBasics } from "./insurance-basics";
import { article as suitedOrNot } from "./suited-or-not";
import { article as womenDrivers } from "./women-drivers";
// 新規（2026-07-28・第2弾）
import { article as gasolineCost } from "./gasoline-cost";
import { article as courierVsLightCargo } from "./courier-vs-light-cargo";
import { article as deliveryTypes } from "./delivery-types";
import { article as work3Days } from "./work-3-days";
import { article as age4050 } from "./age-40-50";
import { article as contractCheck } from "./contract-check";

/** 全記事（公開日の新しい順） */
export const columnArticles: ColumnArticle[] = [
  whatIsLightCargoDriver,
  gyomuItakuBasics,
  startFromBeginner,
  licenseRequirements,
  vehicleLeaseVsOwn,
  dailyGuaranteeVsPiecework,
  driverDailySchedule,
  weeklyPaymentJobs,
  tokyoDriverChecklist,
  taxReturnBasics,
  independenceGuide,
  interviewChecklist,
  tokyoJobComparison,
  blackNumberBasics,
  takeHomeAndExpenses,
  insuranceBasics,
  suitedOrNot,
  womenDrivers,
  gasolineCost,
  courierVsLightCargo,
  deliveryTypes,
  work3Days,
  age4050,
  contractCheck,
].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

export function getArticle(slug: string): ColumnArticle | undefined {
  return columnArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(article: ColumnArticle): ColumnArticle[] {
  return article.related
    .map((slug) => getArticle(slug))
    .filter((a): a is ColumnArticle => Boolean(a))
    .slice(0, 3);
}

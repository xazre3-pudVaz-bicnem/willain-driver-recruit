import { jobCommon } from "@/lib/jobs";

/**
 * 募集要項テーブル。
 * lib/jobs.ts の共通データから描画するため、JobPosting構造化データと必ず一致する。
 * エリア詳細ページでは payLabel / paySupplement にそのエリアの日額を渡す。
 */
export function JobConditionsTable({
  areaName,
  payLabel = jobCommon.payLabel,
  paySupplement = jobCommon.paySupplement,
}: {
  areaName?: string;
  payLabel?: string;
  paySupplement?: string;
}) {
  const rows: { th: string; td: React.ReactNode }[] = [
    { th: "職種", td: jobCommon.title },
    { th: "契約形態", td: `${jobCommon.contractType}（雇用契約ではありません）` },
    {
      th: "報酬",
      td: (
        <>
          <span className="font-bold text-primary-dark">{payLabel}</span>
          <br />
          <span className="text-sm">{paySupplement}</span>
        </>
      ),
    },
    {
      th: "仕事内容",
      td: (
        <ul className="list-disc space-y-1 pl-5">
          {jobCommon.jobDescription.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    {
      th: "勤務時間",
      td: (
        <ul className="list-disc space-y-1 pl-5">
          {jobCommon.workHoursDetail.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    { th: "勤務日数", td: `${jobCommon.workDays}。${jobCommon.workDaysDetail}` },
    {
      th: "応募資格",
      td: (
        <ul className="list-disc space-y-1 pl-5">
          {jobCommon.requirements.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    {
      th: "こんな方を歓迎",
      td: (
        <ul className="list-disc space-y-1 pl-5">
          {jobCommon.welcomeFor.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    {
      th: "待遇・サポート",
      td: (
        <ul className="list-disc space-y-1 pl-5">
          {jobCommon.support.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    ...(areaName ? [{ th: "募集エリア", td: areaName }] : []),
    { th: "備考", td: jobCommon.meetingNote },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-line bg-white">
      <table className="w-full text-left text-sm leading-relaxed md:text-base">
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.th} className="flex flex-col md:table-row">
              <th
                scope="row"
                className="w-full shrink-0 bg-mint/70 px-5 pt-4 pb-1 align-top font-bold whitespace-nowrap text-ink md:w-44 md:px-6 md:py-4"
              >
                {row.th}
              </th>
              <td className="px-5 pt-1 pb-4 text-ink-sub md:px-6 md:py-4">
                {row.td}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  sellerProfile,
  returnsCosts,
  trendData,
  topCostProducts,
} from "@/data/returns";

/* ─── tiny SVG trend chart ─── */
function TrendChart() {
  const W = 320;
  const H = 120;
  const PAD = { top: 12, right: 16, bottom: 28, left: 44 };
  const inner = { w: W - PAD.left - PAD.right, h: H - PAD.top - PAD.bottom };

  const maxRR = 30;
  const minRR = 18;
  const maxCost = 13000;
  const minCost = 7000;

  const rrPoints = trendData.map((d, i) => ({
    x: PAD.left + (i / (trendData.length - 1)) * inner.w,
    y: PAD.top + inner.h - ((d.rr - minRR) / (maxRR - minRR)) * inner.h,
  }));

  const costPoints = trendData.map((d, i) => ({
    x: PAD.left + (i / (trendData.length - 1)) * inner.w,
    y: PAD.top + inner.h - ((d.cost - minCost) / (maxCost - minCost)) * inner.h,
  }));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const toArea = (pts: { x: number; y: number }[]) => {
    const base = PAD.top + inner.h;
    return (
      `${toPath(pts)} L${pts[pts.length - 1].x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Trend zwrotów — ostatnie 3 miesiące"
    >
      {/* grid lines */}
      {[0, 0.5, 1].map((t) => (
        <line
          key={t}
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + inner.h * t}
          y2={PAD.top + inner.h * t}
          stroke="#e0dad0"
          strokeWidth="1"
        />
      ))}

      {/* cost area */}
      <path d={toArea(costPoints)} fill="rgba(33,33,33,0.06)" />
      <path d={toPath(costPoints)} stroke="#212121" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />

      {/* RR line */}
      <path d={toArea(rrPoints)} fill="rgba(220,38,38,0.07)" />
      <path d={toPath(rrPoints)} stroke="#dc2626" strokeWidth="2" fill="none" />

      {/* dots RR */}
      {rrPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#dc2626" />
      ))}

      {/* labels month */}
      {trendData.map((d, i) => (
        <text
          key={i}
          x={PAD.left + (i / (trendData.length - 1)) * inner.w}
          y={H - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#6b6b6b"
        >
          {d.month}
        </text>
      ))}

      {/* y-axis RR labels */}
      <text x={PAD.left - 6} y={PAD.top + inner.h} textAnchor="end" fontSize="9" fill="#6b6b6b">
        {minRR}%
      </text>
      <text x={PAD.left - 6} y={PAD.top} textAnchor="end" fontSize="9" fill="#6b6b6b">
        {maxRR}%
      </text>
    </svg>
  );
}

/* ─── Metric card ─── */
function MetricCard({
  label,
  value,
  sub,
  badge,
  badgeColor = "bg-red-100 text-red-700",
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 border",
        highlight
          ? "border-red-200 bg-red-50"
          : "border-black/10 bg-white"
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-1">{label}</p>
      <p className="text-2xl font-semibold text-charcoal leading-none mb-1">{value}</p>
      {sub && <p className="text-[12px] text-warm-gray">{sub}</p>}
      {badge && (
        <span className={cn("mt-2 inline-block text-[11px] font-medium px-2 py-0.5 rounded-full", badgeColor)}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ─── Product row ─── */
function ProductRow({
  product,
  rank,
  selected,
  onClick,
}: {
  product: (typeof topCostProducts)[0];
  rank: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all",
        selected
          ? "border-charcoal bg-charcoal text-white"
          : "border-black/10 bg-white hover:border-charcoal/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center",
              selected ? "bg-white text-charcoal" : "bg-charcoal text-white"
            )}
          >
            {rank}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium leading-tight truncate">{product.name}</p>
            <p className={cn("text-[11px] mt-0.5", selected ? "text-white/70" : "text-warm-gray")}>
              {product.returnsPerMonth} zwrotów / mies.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[13px] font-semibold">{product.rrPercent}% RR</p>
          <p className={cn("text-[12px]", selected ? "text-white/80" : "text-warm-gray")}>
            {product.costPerMonth.toLocaleString("pl-PL")} PLN
          </p>
        </div>
      </div>
    </button>
  );
}

/* ─── Drilldown panel ─── */
function DrilldownPanel({ product }: { product: (typeof topCostProducts)[0] }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
      <div className="bg-charcoal text-white px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.7px] text-white/60 mb-0.5">Szczegóły produktu</p>
        <p className="font-medium text-[14px]">{product.name}</p>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-3 divide-x divide-black/10 border-b border-black/10">
        {[
          { label: "Return Rate", value: `${product.rrPercent}%` },
          { label: "Zwroty / mies.", value: `${product.returnsPerMonth} szt.` },
          { label: "Koszt / mies.", value: `${product.costPerMonth.toLocaleString("pl-PL")} PLN` },
        ].map(({ label, value }) => (
          <div key={label} className="px-3 py-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.5px] text-warm-gray">{label}</p>
            <p className="text-[14px] font-semibold text-charcoal mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      {/* reasons */}
      <div className="px-4 py-4 border-b border-black/10">
        <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-2">
          Przykładowe przyczyny zwrotów
        </p>
        <ul className="space-y-1.5">
          {product.returnReasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[13px] text-charcoal">
              <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* recommendations */}
      <div className="px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-2">
          Rekomendacje
        </p>
        <ul className="space-y-2">
          {product.recommendations.map((rec, i) => (
            <li key={rec} className="flex items-start gap-2 text-[13px] text-charcoal">
              <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function ZworotyPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const selected = topCostProducts.find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      {/* page header */}
      <div className="bg-white border-b border-black/10">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <p className="text-[11px] text-warm-gray mb-1 uppercase tracking-[0.7px]">
            {sellerProfile.name} · {sellerProfile.category}
          </p>
          <h1 className="text-2xl font-semibold text-charcoal tracking-tight">
            Twoje zwroty
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ── Section 1: Overview metrics ── */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-3">
            Przegląd — kwiecień 2026
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Efektywna prowizja"
              value={`${sellerProfile.effectiveCommission}%`}
              sub={`kontraktowa: ${sellerProfile.contractCommission}%`}
              badge="−5,8 pkt prowizji"
              badgeColor="bg-amber-100 text-amber-800"
            />
            <MetricCard
              label="Koszt zwrotów"
              value={`${returnsCosts.totalMonthly.toLocaleString("pl-PL")} PLN`}
              sub="/ mies."
              badge="↑ vs. marzec"
              badgeColor="bg-red-100 text-red-700"
              highlight
            />
            <MetricCard
              label="Return Rate"
              value={`${returnsCosts.returnRate}%`}
              sub={`top 25%: ${returnsCosts.categoryTopQuartile}%`}
              badge="powyżej średniej"
              badgeColor="bg-red-100 text-red-700"
              highlight
            />
            <MetricCard
              label="Potencjalna oszczędność"
              value={`${returnsCosts.potentialSavings.toLocaleString("pl-PL")} PLN`}
              sub="przy RR = top 25%"
              badge="/ mies."
              badgeColor="bg-green-100 text-green-700"
            />
          </div>
        </section>

        {/* ── Efektywna prowizja wyjaśnienie ── */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[13px] text-amber-900">
          <p className="font-medium mb-1">Czym jest efektywna prowizja?</p>
          <p className="text-[12px] leading-relaxed">
            To Twoja realna prowizja po uwzględnieniu kosztów zwrotów.
            Kontraktujesz 15% — ale każdy zwrot pochłania część przychodu.
            Przy obecnym RR {returnsCosts.returnRate}% Twoja efektywna prowizja
            spada do {sellerProfile.effectiveCommission}%.
          </p>
        </div>

        {/* ── Section 2: Breakdown ── */}
        <section className="rounded-xl bg-white border border-black/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-black/10">
            <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">
              Skład kosztu miesięcznego
            </p>
          </div>
          <div className="divide-y divide-black/5">
            {[
              { label: "Logistyka zwrotów", value: returnsCosts.logistics },
              { label: "Utracona prowizja", value: returnsCosts.lostCommission },
              { label: "Łączny koszt zwrotów", value: returnsCosts.totalMonthly, bold: true },
            ].map(({ label, value, bold }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  bold && "bg-red-50"
                )}
              >
                <span className={cn("text-[13px]", bold ? "font-semibold text-charcoal" : "text-charcoal/80")}>
                  {label}
                </span>
                <span className={cn("text-[13px]", bold ? "font-bold text-red-700" : "text-charcoal")}>
                  {value.toLocaleString("pl-PL")} PLN
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Trend chart ── */}
        <section className="rounded-xl bg-white border border-black/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-4">
            Trend 3-miesięczny
          </p>
          <TrendChart />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-red-500 inline-block" />
              <span className="text-[11px] text-warm-gray">Return Rate (%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-b border-dashed border-charcoal inline-block" />
              <span className="text-[11px] text-warm-gray">Koszt (PLN)</span>
            </div>
          </div>

          {/* month data pills */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {trendData.map((d) => (
              <div key={d.month} className="text-center rounded-lg bg-[#f5f4f1] py-2 px-1">
                <p className="text-[10px] text-warm-gray uppercase tracking-wider">{d.month}</p>
                <p className="text-[13px] font-semibold text-charcoal">{d.rr}%</p>
                <p className="text-[11px] text-warm-gray">{d.cost.toLocaleString("pl-PL")} PLN</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Benchmark ── */}
        <section className="rounded-xl bg-white border border-black/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-3">
            Benchmark — {sellerProfile.category}
          </p>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <p className="text-[11px] text-warm-gray mb-0.5">Ty</p>
              <p className="text-3xl font-bold text-red-600">{returnsCosts.returnRate}%</p>
            </div>
            <div className="flex-1 flex items-center pb-1">
              <div className="h-0.5 flex-1 bg-black/10" />
              <span className="mx-2 text-[11px] text-warm-gray">vs</span>
              <div className="h-0.5 flex-1 bg-black/10" />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-warm-gray mb-0.5">Top 25%</p>
              <p className="text-3xl font-bold text-green-600">{returnsCosts.categoryTopQuartile}%</p>
            </div>
          </div>

          {/* bar visual */}
          <div className="relative h-4 rounded-full bg-[#f0ede8] overflow-hidden mb-2">
            <div
              className="absolute left-0 top-0 h-full bg-red-400 rounded-full transition-all"
              style={{ width: `${(returnsCosts.returnRate / 40) * 100}%` }}
            />
            <div
              className="absolute left-0 top-0 h-full bg-green-500 rounded-full"
              style={{ width: `${(returnsCosts.categoryTopQuartile / 40) * 100}%` }}
            />
          </div>
          <p className="text-[12px] text-charcoal">
            Twój RR jest{" "}
            <strong className="text-red-700">
              {(returnsCosts.returnRate - returnsCosts.categoryTopQuartile).toFixed(1)} pkt
            </strong>{" "}
            wyżej niż top 25% kategorii
          </p>
        </section>

        {/* ── Section 5: Product drilldown ── */}
        <section>
          <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray mb-3">
            Produkty generujące najwyższy koszt
          </p>
          <p className="text-[12px] text-warm-gray mb-4">
            Kliknij produkt, aby zobaczyć przyczyny zwrotów i rekomendacje.
          </p>
          <div className="space-y-2">
            {topCostProducts.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                rank={i + 1}
                selected={selectedProduct === p.id}
                onClick={() =>
                  setSelectedProduct(selectedProduct === p.id ? null : p.id)
                }
              />
            ))}
          </div>

          {/* drilldown panel */}
          {selected && (
            <div className="mt-4">
              <DrilldownPanel product={selected} />
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <div className="pb-8">
          <Link
            href="/seller/zwroty/plan"
            className="block w-full text-center bg-charcoal text-white text-[13px] font-semibold uppercase tracking-[0.8px] py-4 rounded-xl hover:bg-charcoal/90 transition-colors"
          >
            Przygotuj plan obniżenia zwrotów →
          </Link>
          <p className="text-center text-[11px] text-warm-gray mt-2">
            Zajmie to ok. 3 minuty
          </p>
        </div>
      </div>
    </div>
  );
}

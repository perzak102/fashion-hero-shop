"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { topCostProducts, returnsCosts, sellerProfile } from "@/data/returns";

/* ─── types ─── */
interface PlanState {
  surprisedBy: string;
  surprisedWhy: string;
  returnDriver: string;
  reductionGoalPct: number;
  actionText: string;
  actionChecks: string[];
  selectedProducts: string[];
  confidence: number;
}

const TOTAL_STEPS = 6;

/* ─── helpers ─── */
function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-charcoal text-white text-[11px] font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <p className="text-[11px] uppercase tracking-[0.7px] text-warm-gray">
          Krok {step} z {TOTAL_STEPS}
        </p>
      </div>
      <h2 className="text-[17px] font-semibold text-charcoal leading-snug">{title}</h2>
      {subtitle && (
        <p className="text-[12px] text-warm-gray mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex gap-1 mb-6">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-1 rounded-full transition-all",
            i < step ? "bg-charcoal" : "bg-black/15"
          )}
        />
      ))}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  multi,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 rounded-xl border text-[13px] transition-all flex items-start gap-3",
        selected
          ? "border-charcoal bg-charcoal text-white"
          : "border-black/10 bg-white text-charcoal hover:border-charcoal/40"
      )}
    >
      <span
        className={cn(
          "shrink-0 mt-0.5 w-4 h-4 border rounded flex items-center justify-center transition-all",
          multi ? "rounded" : "rounded-full",
          selected ? "border-white bg-white" : "border-black/30"
        )}
      >
        {selected && (
          <span className={cn("block bg-charcoal", multi ? "w-2 h-2 rounded-sm" : "w-2 h-2 rounded-full")} />
        )}
      </span>
      {children}
    </button>
  );
}

/* ─── Goal calculator ─── */
function GoalCalculator({
  pct,
  onSelect,
}: {
  pct: number;
  onSelect: (v: number) => void;
}) {
  const options = [5, 20, 40];
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const saving = Math.round(returnsCosts.totalMonthly * (opt / 100));
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-all",
              pct === opt
                ? "border-charcoal bg-charcoal text-white"
                : "border-black/10 bg-white hover:border-charcoal/40"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold">Redukcja o {opt}%</p>
                <p className={cn("text-[12px] mt-0.5", pct === opt ? "text-white/70" : "text-warm-gray")}>
                  nowy RR: ok.{" "}
                  {(returnsCosts.returnRate * (1 - opt / 100)).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className={cn("text-[13px] font-bold", pct === opt ? "text-green-300" : "text-green-600")}>
                  +{saving.toLocaleString("pl-PL")} PLN
                </p>
                <p className={cn("text-[11px]", pct === opt ? "text-white/60" : "text-warm-gray")}>
                  oszczędność / mies.
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Confidence slider ─── */
function ConfidenceSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const labels: Record<number, string> = {
    1: "strzał w ciemno",
    3: "niepewny",
    5: "średnio pewny",
    7: "dość pewny",
    10: "jestem pewien",
  };

  const label = (() => {
    if (value <= 2) return labels[1];
    if (value <= 4) return labels[3];
    if (value <= 6) return labels[5];
    if (value <= 8) return labels[7];
    return labels[10];
  })();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-warm-gray">Strzał w ciemno</span>
        <span className="text-[12px] text-warm-gray">Jestem pewien</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-charcoal"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-warm-gray">1</span>
        <span className={cn(
          "text-[13px] font-semibold px-3 py-1 rounded-full",
          value >= 7 ? "bg-green-100 text-green-800" :
          value >= 4 ? "bg-amber-100 text-amber-800" :
          "bg-red-100 text-red-700"
        )}>
          {value}/10 — {label}
        </span>
        <span className="text-[11px] text-warm-gray">10</span>
      </div>
    </div>
  );
}

/* ─── Summary card ─── */
function SummaryCard({ plan }: { plan: PlanState }) {
  const surprisedLabels: Record<string, string> = {
    commission: `Efektywna prowizja ${returnsCosts.returnRate}% zamiast 15%`,
    cost: `Koszt zwrotów 11 580 PLN/mies.`,
    rr: `Return Rate ${returnsCosts.returnRate}% vs ${returnsCosts.categoryTopQuartile}%`,
  };

  const driverLabels: Record<string, string> = {
    size: "Rozmiar / krój",
    photo: "Jakość zdjęć / opisu",
    material: "Jakość materiału",
    logistics: "Logistyka",
    nodata: "Potrzebuję więcej danych",
  };

  const selectedProductNames = topCostProducts
    .filter((p) => plan.selectedProducts.includes(p.id))
    .map((p) => p.name);

  return (
    <div className="rounded-xl border border-black/10 bg-[#f5f4f1] divide-y divide-black/10 text-[13px]">
      {[
        { label: "Co cię zaskoczyło", value: surprisedLabels[plan.surprisedBy] ?? "—" },
        { label: "Główna przyczyna zwrotów", value: driverLabels[plan.returnDriver] ?? "—" },
        { label: "Cel redukcji", value: `−${plan.reductionGoalPct}% RR` },
        { label: "Plan działania", value: plan.actionText || "—" },
        { label: "Wybrane produkty", value: selectedProductNames.join(", ") || "—" },
        { label: "Pewność co do planu", value: `${plan.confidence}/10` },
      ].map(({ label, value }) => (
        <div key={label} className="flex gap-3 px-4 py-3">
          <span className="w-32 shrink-0 text-[11px] uppercase tracking-[0.5px] text-warm-gray pt-0.5">
            {label}
          </span>
          <span className="text-charcoal">{value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main page ─── */
export default function PlanPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [plan, setPlan] = useState<PlanState>({
    surprisedBy: "",
    surprisedWhy: "",
    returnDriver: "",
    reductionGoalPct: 0,
    actionText: "",
    actionChecks: [],
    selectedProducts: [],
    confidence: 5,
  });

  const update = (partial: Partial<PlanState>) =>
    setPlan((prev) => ({ ...prev, ...partial }));

  const toggleCheck = (val: string) => {
    update({
      actionChecks: plan.actionChecks.includes(val)
        ? plan.actionChecks.filter((v) => v !== val)
        : [...plan.actionChecks, val],
    });
  };

  const toggleProduct = (id: string) => {
    update({
      selectedProducts: plan.selectedProducts.includes(id)
        ? plan.selectedProducts.filter((v) => v !== id)
        : [...plan.selectedProducts, id],
    });
  };

  const validateStep = (): string => {
    if (step === 1 && !plan.surprisedBy) return "Wybierz, co najbardziej cię zaskoczyło.";
    if (step === 2 && !plan.returnDriver) return "Wybierz główną przyczynę zwrotów.";
    if (step === 3 && !plan.reductionGoalPct) return "Wybierz cel redukcji.";
    if (step === 4 && plan.actionText.trim().length < 20)
      return "Opisz swój plan — minimum 20 znaków.";
    if (step === 5 && plan.selectedProducts.length === 0)
      return "Wybierz przynajmniej jeden produkt.";
    return "";
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    if (step < TOTAL_STEPS) setStep(step + 1);
    else setSubmitted(true);
  };

  /* ── SUBMITTED state ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f4f1]">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-charcoal mb-2">Plan wysłany!</h1>
            <p className="text-[13px] text-warm-gray max-w-xs mx-auto">
              Dziękujemy. Twój plan trafia do naszego teamu i posłuży do projektowania narzędzi dla sprzedawców.
            </p>
          </div>

          <SummaryCard plan={plan} />

          <div className="mt-6 space-y-3">
            <Link
              href="/seller/zwroty"
              className="block w-full text-center bg-charcoal text-white text-[13px] font-semibold uppercase tracking-[0.8px] py-4 rounded-xl hover:bg-charcoal/90 transition-colors"
            >
              ← Wróć do dashboardu
            </Link>
            <Link
              href="/"
              className="block w-full text-center border border-black/20 text-charcoal text-[13px] font-medium py-4 rounded-xl hover:bg-black/5 transition-colors"
            >
              Strona główna
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      {/* header */}
      <div className="bg-white border-b border-black/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            href="/seller/zwroty"
            className="text-[12px] text-warm-gray hover:text-charcoal flex items-center gap-1.5 transition-colors"
          >
            ← Wróć do dashboardu
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-charcoal">Plan działania</h1>
          <p className="text-[13px] text-warm-gray mt-1">
            Twoja reakcja na dashboard zwrotów
          </p>
        </div>

        <ProgressBar step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <StepHeader
              step={1}
              title="Co w dashboardzie zaskoczyło cię najbardziej?"
              subtitle="Wybierz jedną odpowiedź"
            />
            <div className="space-y-2">
              {[
                { id: "commission", label: `Efektywna prowizja ${sellerProfile.effectiveCommission}% zamiast ${sellerProfile.contractCommission}%` },
                { id: "cost", label: `Koszt zwrotów ${returnsCosts.totalMonthly.toLocaleString("pl-PL")} PLN / mies.` },
                { id: "rr", label: `Return Rate ${returnsCosts.returnRate}% vs ${returnsCosts.categoryTopQuartile}% (top 25%)` },
              ].map(({ id, label }) => (
                <OptionButton
                  key={id}
                  selected={plan.surprisedBy === id}
                  onClick={() => update({ surprisedBy: id })}
                >
                  {label}
                </OptionButton>
              ))}
            </div>

            {plan.surprisedBy && (
              <div className="mt-4">
                <label className="block text-[12px] text-warm-gray mb-1.5">
                  Dlaczego to cię zaskoczyło? <span className="text-black/30">(opcjonalne)</span>
                </label>
                <textarea
                  value={plan.surprisedWhy}
                  onChange={(e) => update({ surprisedWhy: e.target.value })}
                  rows={3}
                  placeholder="Np. nie wiedziałem, że zwroty aż tak wpływają na prowizję…"
                  className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-[13px] text-charcoal placeholder:text-black/30 focus:outline-none focus:border-charcoal transition-colors resize-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <StepHeader
              step={2}
              title="Co twoim zdaniem jest główną przyczyną zwrotów?"
              subtitle="Wybierz jedną odpowiedź"
            />
            <div className="space-y-2">
              {[
                { id: "size", label: "Rozmiar / krój — produkty bywają zbyt duże lub małe" },
                { id: "photo", label: "Jakość zdjęć / opisu — klient dostaje co innego niż oczekiwał" },
                { id: "material", label: "Jakość materiału — produkt nie spełnia oczekiwań" },
                { id: "logistics", label: "Logistyka — uszkodzenia w transporcie" },
                { id: "nodata", label: "Potrzebuję więcej danych, żeby odpowiedzieć" },
              ].map(({ id, label }) => (
                <OptionButton
                  key={id}
                  selected={plan.returnDriver === id}
                  onClick={() => update({ returnDriver: id })}
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <StepHeader
              step={3}
              title="Jaki jest twój cel redukcji kosztu zwrotów?"
              subtitle="Wybierz poziom ambicji"
            />
            <div className="rounded-xl bg-white border border-black/10 px-4 py-3 mb-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-warm-gray">Obecny koszt</span>
                <span className="font-semibold text-red-700">
                  {returnsCosts.totalMonthly.toLocaleString("pl-PL")} PLN / mies.
                </span>
              </div>
            </div>
            <GoalCalculator pct={plan.reductionGoalPct} onSelect={(v) => update({ reductionGoalPct: v })} />
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div>
            <StepHeader
              step={4}
              title="Co konkretnie zrobisz, żeby obniżyć RR?"
              subtitle="Opisz swój plan własnymi słowami (min. 20 znaków)"
            />

            <textarea
              value={plan.actionText}
              onChange={(e) => update({ actionText: e.target.value })}
              rows={5}
              maxLength={1000}
              placeholder="Np. Poprawię zdjęcia w Cloud Runner Sneakers — dodam ujęcia z boku i z góry. Dla Trail Pacer Hiking Boots dodam informację o szerokości…"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-[13px] text-charcoal placeholder:text-black/30 focus:outline-none focus:border-charcoal transition-colors resize-none mb-4"
            />
            <div className="flex justify-end mb-5">
              <span className="text-[11px] text-warm-gray">
                {plan.actionText.length}/1000
              </span>
            </div>

            <p className="text-[12px] text-warm-gray mb-2 uppercase tracking-[0.6px]">
              Zaznacz konkretne działania
            </p>
            <div className="space-y-2">
              {[
                { id: "sizes", label: "Dodaj tabelę rozmiarów z miarkami w cm" },
                { id: "photo", label: "Zmień zdjęcie główne (bok + góra + detal)" },
                { id: "desc", label: "Zaktualizuj opis produktu" },
                { id: "limit", label: "Ogranicz dostępność problematycznych rozmiarów" },
                { id: "supplier", label: "Zmień dostawcę lub materiał" },
              ].map(({ id, label }) => (
                <OptionButton
                  key={id}
                  multi
                  selected={plan.actionChecks.includes(id)}
                  onClick={() => toggleCheck(id)}
                >
                  {label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <div>
            <StepHeader
              step={5}
              title="Dla których produktów masz konkretny plan?"
              subtitle="Możesz wybrać kilka"
            />
            <div className="space-y-2">
              {topCostProducts.map((p) => (
                <OptionButton
                  key={p.id}
                  multi
                  selected={plan.selectedProducts.includes(p.id)}
                  onClick={() => toggleProduct(p.id)}
                >
                  <div className="flex-1 flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-[12px] opacity-75 shrink-0 ml-4">
                      {p.rrPercent}% RR · {p.costPerMonth.toLocaleString("pl-PL")} PLN
                    </span>
                  </div>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6 ── */}
        {step === 6 && (
          <div>
            <StepHeader
              step={6}
              title="Jak pewny jesteś swojego planu?"
              subtitle="Skala od 1 (strzał w ciemno) do 10 (jestem pewien)"
            />
            <div className="rounded-xl bg-white border border-black/10 p-5 mb-6">
              <ConfidenceSlider
                value={plan.confidence}
                onChange={(v) => update({ confidence: v })}
              />
            </div>

            <p className="text-[12px] uppercase tracking-[0.6px] text-warm-gray mb-3">
              Podsumowanie twojego planu
            </p>
            <SummaryCard plan={plan} />
          </div>
        )}

        {/* ── error + nav ── */}
        {error && (
          <p className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => { setStep(step - 1); setError(""); }}
              className="flex-1 border border-black/15 text-charcoal text-[13px] font-medium py-4 rounded-xl hover:bg-black/5 transition-colors"
            >
              ← Wstecz
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-charcoal text-white text-[13px] font-semibold uppercase tracking-[0.7px] py-4 rounded-xl hover:bg-charcoal/90 transition-colors"
          >
            {step < TOTAL_STEPS ? "Dalej →" : "Wyślij swój plan"}
          </button>
        </div>

        <p className="text-center text-[11px] text-warm-gray mt-3">
          * Pola oznaczone gwiazdką są wymagane
        </p>
      </div>
    </div>
  );
}

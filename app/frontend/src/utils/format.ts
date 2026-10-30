// Formatação padrão de números e datas (pt-BR). Funções estáveis: podem ir direto em props de gráfico.

const percentFormatter = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
const decimalFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 });
const compactFormatter = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

export const formatPercent = (v: number) => percentFormatter.format(v);
export const formatDecimal = (v: number) => decimalFormatter.format(v);
export const formatCompact = (v: number) => (Math.abs(v) >= 10_000 ? compactFormatter.format(v) : decimalFormatter.format(v));

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}

/** sepal_length → Sepal length */
export function humanize(name: string): string {
  const text = name.replace(/_/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

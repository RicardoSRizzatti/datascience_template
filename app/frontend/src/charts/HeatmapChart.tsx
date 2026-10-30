/**
 * Mapa de calor em escala sequencial (um matiz, claro → escuro). Ex.: matriz de confusão.
 * O valor aparece dentro da célula, em branco ou quase preto conforme o tom do fundo.
 * matrix[linha][coluna] → linha = yLabels[i], coluna = xLabels[j].
 */
import { useMemo } from "react";

import { Chart } from "./Chart";
import type { ChartOption } from "./echarts";
import { baseOption, categoryAxis, useChartTokens } from "./theme";

const defaultFormat = (v: number) => v.toLocaleString("pt-BR");

interface HeatmapChartProps {
  label: string;
  xLabels: string[];
  yLabels: string[];
  matrix: number[][];
  xName: string;
  yName: string;
  format?: (value: number) => string;
  tooltip?: (row: string, col: string, value: number) => string;
}

export function HeatmapChart({
  label,
  xLabels,
  yLabels,
  matrix,
  xName,
  yName,
  format = defaultFormat,
  tooltip,
}: HeatmapChartProps) {
  const t = useChartTokens();

  const option = useMemo<ChartOption>(() => {
    const maxValue = Math.max(1, ...matrix.flat());
    const steps = t.sequential.length;
    const stepOf = (v: number) => (v <= 0 ? 0 : Math.min(steps - 1, 1 + Math.floor((v / maxValue) * (steps - 2))));

    const data = matrix.flatMap((row, i) =>
      row.map((value, j) => {
        const step = stepOf(value);
        return {
          value: [j, i, value],
          itemStyle: { color: t.sequential[step], borderColor: t.surface, borderWidth: 2, borderRadius: 4 },
          label: { color: t.sequentialLabel[step] },
        };
      }),
    );

    return {
      ...baseOption(t),
      grid: { left: 8, right: 8, top: 8, bottom: 36, containLabel: true },
      tooltip: {
        ...baseOption(t).tooltip,
        trigger: "item",
        formatter: (p: { value: [number, number, number] }) => {
          const [j, i, v] = p.value;
          return tooltip ? tooltip(yLabels[i], xLabels[j], v) : `${yLabels[i]} × ${xLabels[j]}: <b>${format(v)}</b>`;
        },
      },
      xAxis: categoryAxis(t, xLabels, {
        name: xName,
        nameLocation: "middle",
        nameGap: 28,
        axisLine: { show: false },
      }),
      yAxis: categoryAxis(t, yLabels, {
        name: yName,
        nameLocation: "middle",
        nameGap: 72,
        inverse: true,
        axisLine: { show: false },
      }),
      series: [
        {
          type: "heatmap",
          data,
          label: { show: true, fontSize: 13, fontWeight: 600, formatter: (p: { value: number[] }) => format(p.value[2]) },
          emphasis: { disabled: true },
        },
      ],
    };
  }, [t, xLabels, yLabels, matrix, xName, yName, format, tooltip]);

  return (
    <Chart
      label={label}
      option={option}
      height={Math.max(200, yLabels.length * 56 + 60)}
      table={{
        columns: [`${yName} \\ ${xName}`, ...xLabels],
        rows: yLabels.map((y, i) => [y, ...matrix[i].map(format)]),
      }}
    />
  );
}

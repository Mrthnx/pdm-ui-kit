import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmChartType = 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial' | 'tooltips';

/**
 * Formats a numeric data point into the string rendered by the chart.
 *
 * @param value the raw numeric value of the data point
 * @param index the zero-based index of the data point
 */
export type PdmChartValueFormatter = (value: number, index: number) => string;

@Component({
  selector: 'pdm-chart',
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmChartComponent {
  @Input() type: PdmChartType = 'bar';
  @Input() className = '';
  @Input() title = '';
  @Input() description = '';

  @Input() desktopLabel = '';
  @Input() desktopValue = '';
  @Input() mobileLabel = '';
  @Input() mobileValue = '';

  @Input() labels: string[] = [];

  @Input() bars: number[] = [];
  @Input() line: number[] = [];
  @Input() pie: number[] = [];
  @Input() radar: number[] = [];
  @Input() radialValue = 0;
  @Input() radialLabel = '';
  @Input() radialDescription = '';
  @Input() tooltipTitle = '';
  @Input() tooltipPrimaryLabel = '';
  @Input() tooltipPrimaryValue = '';
  @Input() tooltipSecondaryLabel = '';
  @Input() tooltipSecondaryValue = '';
  @Input() pieLabels: string[] = [];
  @Input() tooltipHint = '';
  @Input() radarMetricPrefix = 'Metric';
  @Input() emptyLabel = 'No data available';

  /**
   * Optional CSS color per data point (e.g. `['#dc2626', '#eab308', '#16a34a']`).
   *
   * Applied to bar chart bars and pie chart segments (including the legend swatches).
   * When a color is not provided the chart keeps its default palette.
   */
  @Input() colors?: string[];

  /**
   * Optional formatter for the numeric values rendered by the chart.
   *
   * When provided, bar charts render a value row above the labels row, radar charts
   * format the metric list values and radial charts format the center percentage.
   */
  @Input() valueFormatter?: PdmChartValueFormatter;

  /**
   * Resolves the CSS background color for a bar chart data point.
   *
   * Returns `null` when no color was provided for the given index so the default
   * `bg-primary` class keeps applying.
   */
  barColor(index: number): string | null {
    const colors = this.colors;

    if (!colors || !colors.length) {
      return null;
    }

    return colors[index] ?? null;
  }

  /**
   * Formats a numeric value with the configured `valueFormatter`.
   *
   * Falls back to the raw value as a string when no formatter is set.
   */
  formatValue(value: number, index: number): string {
    const formatter = this.valueFormatter;

    return formatter ? formatter(value, index) : String(value);
  }

  /**
   * Center value of a radial chart, formatted with `valueFormatter` when set.
   */
  get radialDisplayValue(): string {
    const formatter = this.valueFormatter;

    return formatter ? formatter(this.radialValue, 0) : `${this.radialValue}%`;
  }

  get normalizedBars(): number[] {
    if (!this.bars.length) {
      return [];
    }

    const max = Math.max(...this.bars);
    if (max === 0) {
      return this.bars.map(() => 0);
    }

    return this.bars.map((value) => Math.max(8, Math.round((value / max) * 183)));
  }

  get normalizedLine(): number[] {
    if (!this.line.length) {
      return [];
    }

    const max = Math.max(...this.line);
    if (max === 0) {
      return this.line.map(() => 170);
    }

    return this.line.map((value) => 180 - Math.round((value / max) * 150));
  }

  get linePath(): string {
    const points = this.normalizedLine;
    if (!points.length) {
      return '';
    }

    const step = points.length > 1 ? 320 / (points.length - 1) : 0;
    return points
      .map((y, index) => `${index === 0 ? 'M' : 'L'} ${Math.round(index * step)} ${y}`)
      .join(' ');
  }

  get areaPath(): string {
    const linePath = this.linePath;
    if (!linePath) {
      return '';
    }

    return `${linePath} L 320 180 L 0 180 Z`;
  }

  get pieSegments(): { color: string; size: number; offset: number; label: string }[] {
    const total = this.pie.reduce((acc, value) => acc + Math.max(value, 0), 0);
    if (total === 0) {
      return [];
    }

    let offset = 0;
    const fallbackColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
    const providedColors = this.colors;
    return this.pie.map((value, index) => {
      const size = (Math.max(value, 0) / total) * 100;
      const provided = providedColors?.[index];
      const segment = {
        color: provided || fallbackColors[index % fallbackColors.length],
        size,
        offset,
        label: this.pieLabels[index] ?? `Series ${index + 1}`
      };
      offset += size;
      return segment;
    });
  }

  get pieGradient(): string {
    const segments = this.pieSegments;
    if (!segments.length) {
      return 'conic-gradient(hsl(var(--muted)) 0 100%)';
    }

    return `conic-gradient(${segments
      .map((segment) => `${segment.color} ${segment.offset}% ${segment.offset + segment.size}%`)
      .join(', ')})`;
  }

  get radarPoints(): string {
    const values = this.radar.slice(0, 6);
    if (!values.length) {
      return '';
    }

    const max = Math.max(...values, 1);
    const radius = 72;
    const center = 80;
    return values
      .map((value, index) => {
        const angle = ((Math.PI * 2) / values.length) * index - Math.PI / 2;
        const valueRadius = (Math.max(value, 0) / max) * radius;
        const x = center + Math.cos(angle) * valueRadius;
        const y = center + Math.sin(angle) * valueRadius;
        return `${x},${y}`;
      })
      .join(' ');
  }

  get radialStrokeOffset(): number {
    const bounded = Math.max(0, Math.min(this.radialValue, 100));
    const circumference = 2 * Math.PI * 42;
    return circumference - (bounded / 100) * circumference;
  }
}

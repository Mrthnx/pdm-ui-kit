import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmChartType = 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial' | 'tooltips';

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
    const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
    return this.pie.map((value, index) => {
      const size = (Math.max(value, 0) / total) * 100;
      const segment = {
        color: colors[index % colors.length],
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

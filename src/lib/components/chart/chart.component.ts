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
  @Input() title = 'Bar Chart - Interactive';
  @Input() description = 'Showing total visitors for the last 3 months';

  @Input() desktopLabel = 'Desktop';
  @Input() desktopValue = '24,828';
  @Input() mobileLabel = 'Mobile';
  @Input() mobileValue = '25,010';

  @Input() labels: string[] = ['Apr 9', 'Apr 19', 'Apr 29', 'May 9', 'May 19', 'May 29', 'Jun 9', 'Jun 19', 'Jun 30'];

  @Input() bars: number[] = [
    48, 21, 53, 69, 56, 77, 12, 54, 61, 59, 66, 27, 24, 27, 84, 62, 44, 18, 45, 57,
    45, 72, 56, 15, 73, 25, 59, 86, 49, 59, 69, 93, 96, 72, 30, 58, 75, 67, 43, 43,
    84, 89, 62, 96, 59, 72, 82, 34, 34, 70, 62, 42, 40, 80, 60, 33, 67, 34, 34, 88,
    22, 84, 19, 62, 56, 43, 95, 70, 67, 89, 84, 31, 18, 92, 16, 87, 54, 44, 91, 23,
    67, 77, 49, 59, 93, 26, 29, 81, 84, 30, 22, 84
  ];
  @Input() line: number[] = [40, 28, 56, 49, 73, 67, 81, 58, 92];
  @Input() pie: number[] = [35, 28, 20, 17];
  @Input() radar: number[] = [72, 58, 88, 64, 79, 70];
  @Input() radialValue = 76;
  @Input() radialLabel = 'Completion';
  @Input() radialDescription = 'Updated monthly';
  @Input() tooltipTitle = 'June 2024';
  @Input() tooltipPrimaryLabel = 'Desktop';
  @Input() tooltipPrimaryValue = '12,450';
  @Input() tooltipSecondaryLabel = 'Mobile';
  @Input() tooltipSecondaryValue = '8,110';
  @Input() pieLabels: string[] = ['Desktop', 'Mobile', 'Tablet', 'Other'];

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

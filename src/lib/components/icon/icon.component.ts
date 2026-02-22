import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons, type IconNode } from 'lucide';

export type PdmIconLibrary = 'lucide' | 'tabler' | 'hugeicons' | 'phosphor' | 'remix';

export type PdmIconName =
  | 'command'
  | 'check'
  | 'check-circle'
  | 'circle'
  | 'dot'
  | 'x'
  | 'alert-circle'
  | 'info'
  | 'loader-2'
  | 'menu'
  | 'search'
  | 'calendar'
  | 'panel-left'
  | 'monitor'
  | 'laptop'
  | 'sun'
  | 'moon'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevrons-left'
  | 'chevrons-right'
  | 'chevrons-up-down'
  | 'arrow-up-down'
  | 'ellipsis'
  | 'filter'
  | 'sort-asc'
  | 'sort-desc'
  | 'plus'
  | 'minus'
  | 'copy'
  | 'pencil'
  | 'trash-2'
  | 'download'
  | 'upload'
  | 'home'
  | 'mail'
  | 'phone'
  | 'log-in'
  | 'log-out'
  | 'user'
  | 'settings'
  | 'credit-card'
  | 'smile'
  | 'calculator'
  | 'external-link'
  | 'folder'
  | 'arrow-up-right';

const FALLBACK_NODE: IconNode = [['circle', { cx: '12', cy: '12', r: '9' }]];

@Component({
  selector: 'pdm-icon',
  templateUrl: './icon.component.html',
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        flex-shrink: 0;
      }

      :host svg {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmIconComponent {
  @Input() name: PdmIconName | string = 'check';
  @Input() library: PdmIconLibrary = 'lucide';
  @Input() assetUrl: string | null = null;
  @Input() size = 16;
  @Input() strokeWidth = 1.5;
  @Input() className = '';
  @Input() ariaLabel: string | null = null;
  @Input() decorative = false;

  private readonly lucideIndex = this.buildLucideIndex();

  private readonly aliasMapByLibrary: Record<PdmIconLibrary, Record<string, string>> = {
    lucide: {
      'check-circle': 'circle-check',
      'alert-circle': 'circle-alert',
      info: 'circle-info',
      'sort-asc': 'arrow-up-a-z',
      'sort-desc': 'arrow-down-z-a'
    },
    tabler: {
      'alert-triangle': 'triangle-alert',
      'user-circle': 'circle-user',
      'settings-2': 'settings-2',
      'external-link': 'external-link'
    },
    hugeicons: {
      'alert-02': 'circle-alert',
      'user-circle': 'circle-user',
      'search-01': 'search',
      'settings-01': 'settings',
      'arrow-right-01': 'chevron-right',
      'arrow-down-01': 'chevron-down'
    },
    phosphor: {
      'warning-circle': 'circle-alert',
      'caret-down': 'chevron-down',
      'caret-right': 'chevron-right',
      'user-circle': 'circle-user',
      gear: 'settings',
      'arrow-square-out': 'external-link'
    },
    remix: {
      'alert-line': 'circle-alert',
      'arrow-right-line': 'chevron-right',
      'arrow-down-s-line': 'chevron-down',
      'external-link-line': 'external-link',
      'user-line': 'user',
      'settings-3-line': 'settings'
    }
  };

  constructor(private readonly sanitizer: DomSanitizer) {}

  get resolvedStrokeWidth(): number {
    const value = Number(this.strokeWidth);
    if (Number.isFinite(value) && value > 0) {
      return value;
    }

    if (this.library === 'phosphor') {
      return 1.6;
    }

    if (this.library === 'tabler') {
      return 1.8;
    }

    return 1.5;
  }

  get resolvedSize(): number {
    const value = Number(this.size);
    return Number.isFinite(value) && value > 0 ? value : 16;
  }

  get iconKey(): string {
    const raw = `${this.name || ''}`.trim();
    if (!raw) {
      return 'circle';
    }

    const trimmed = raw.replace(/^(lucide|tabler|hugeicons|phosphor|remix)\//, '');
    const aliases = this.aliasMapByLibrary[this.library] ?? {};
    return aliases[trimmed] ?? trimmed;
  }

  get svgMarkup(): SafeHtml {
    const node = this.resolveIconNode(this.iconKey) ?? FALLBACK_NODE;
    const strokeWidth = this.escapeAttr(this.resolvedStrokeWidth);
    const size = this.escapeAttr(this.resolvedSize);

    const body = node
      .map(([tag, attrs]) => {
        const serializedAttrs = Object.entries(attrs)
          .map(([key, value]) => `${key}="${this.escapeAttr(value)}"`)
          .join(' ');

        return serializedAttrs ? `<${tag} ${serializedAttrs}></${tag}>` : `<${tag}></${tag}>`;
      })
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  private resolveIconNode(iconName: string): IconNode | null {
    const normalized = this.normalizeIconName(iconName);
    return this.lucideIndex.get(normalized) ?? null;
  }

  private normalizeIconName(name: string): string {
    return `${name || ''}`.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private buildLucideIndex(): Map<string, IconNode> {
    const map = new Map<string, IconNode>();

    Object.entries(icons).forEach(([iconName, iconNode]) => {
      map.set(this.normalizeIconName(iconName), iconNode as IconNode);
    });

    return map;
  }

  private escapeAttr(value: unknown): string {
    return `${value ?? ''}`
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

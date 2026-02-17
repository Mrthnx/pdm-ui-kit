import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

@Component({
  selector: 'pdm-icon',
  templateUrl: './icon.component.html',
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

  get resolvedStrokeWidth(): number {
    if (this.strokeWidth) {
      return this.strokeWidth;
    }

    if (this.library === 'phosphor') {
      return 1.6;
    }

    if (this.library === 'tabler') {
      return 1.8;
    }

    return 1.5;
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

  private readonly aliasMapByLibrary: Record<PdmIconLibrary, Record<string, string>> = {
    lucide: {},
    tabler: {
      'alert-triangle': 'alert-circle',
      'chevron-down': 'chevron-down',
      'chevron-right': 'chevron-right',
      'user-circle': 'user',
      'settings-2': 'settings',
      'external-link': 'external-link'
    },
    hugeicons: {
      'alert-02': 'alert-circle',
      'user-circle': 'user',
      'search-01': 'search',
      'settings-01': 'settings',
      'arrow-right-01': 'chevron-right',
      'arrow-down-01': 'chevron-down'
    },
    phosphor: {
      'warning-circle': 'alert-circle',
      'caret-down': 'chevron-down',
      'caret-right': 'chevron-right',
      'user-circle': 'user',
      gear: 'settings',
      'arrow-square-out': 'external-link'
    },
    remix: {
      'alert-line': 'alert-circle',
      'arrow-right-line': 'chevron-right',
      'arrow-down-s-line': 'chevron-down',
      'external-link-line': 'external-link',
      'user-line': 'user',
      'settings-3-line': 'settings'
    }
  };
}

import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmDialogComponent, PdmDialogVariant, PdmDialogSize } from '../dialog.component';

export interface PdmDialogHarnessFilters {
  selector?: string;
  title?: string;
}

export class PdmDialogHarness extends ComponentHarness {
  static hostSelector = 'pdm-dialog';

  static with(options: PdmDialogHarnessFilters): HarnessPredicate<PdmDialogHarness> {
    return new HarnessPredicate(PdmDialogHarness, options)
      .addOption('title', options.title, (harness, title) =>
        HarnessPredicate.stringMatches(harness.getTitle(), title)
      );
  }

  protected dialog = this.locatorFor('[role="dialog"]');
  protected closeButton = this.locatorForOptional('button[aria-label="Close dialog"]');
  protected primaryButton = this.locatorForOptional('[role="dialog"] button:last-child');

  async isOpen(): Promise<boolean> {
    try {
      await this.dialog();
      return true;
    } catch {
      return false;
    }
  }

  async getTitle(): Promise<string> {
    try {
      const heading = await this.locatorForOptional('[role="dialog"] h2')();
      return heading ? heading.text() : '';
    } catch {
      return '';
    }
  }

  async getDescription(): Promise<string> {
    try {
      const description = await this.locatorForOptional('[role="dialog"] p')();
      return description ? description.text() : '';
    } catch {
      return '';
    }
  }

  async close(): Promise<void> {
    const closeBtn = await this.closeButton();
    if (closeBtn) {
      return closeBtn.click();
    }
  }

  async clickPrimaryAction(): Promise<void> {
    const btn = await this.primaryButton();
    if (btn) {
      return btn.click();
    }
  }

  async clickSecondaryAction(): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length >= 2) {
      return buttons[buttons.length - 2].click();
    }
  }

  async getVariant(): Promise<PdmDialogVariant> {
    const component = await this.getComponentInstance();
    return component.variant;
  }

  async getSize(): Promise<PdmDialogSize> {
    const component = await this.getComponentInstance();
    return component.size;
  }

  async getPrimaryActionText(): Promise<string> {
    const component = await this.getComponentInstance();
    return component.primaryActionText;
  }

  async getSecondaryActionText(): Promise<string> {
    const component = await this.getComponentInstance();
    return component.secondaryActionText;
  }

  async hasCloseButton(): Promise<boolean> {
    return !!(await this.closeButton());
  }

  async getContent(): Promise<string> {
    const dialog = await this.dialog();
    return dialog.text();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmDialogComponent as any)();
  }
}

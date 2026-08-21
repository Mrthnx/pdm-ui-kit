import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmButtonComponent, PdmButtonVariant, PdmButtonSize } from '../button.component';

export interface PdmButtonHarnessFilters {
  selector?: string;
  variant?: PdmButtonVariant;
  text?: string;
}

export class PdmButtonHarness extends ComponentHarness {
  static hostSelector = 'pdm-button';

  static with(options: PdmButtonHarnessFilters): HarnessPredicate<PdmButtonHarness> {
    return new HarnessPredicate(PdmButtonHarness, options)
      .addOption('variant', options.variant, (harness, variant) =>
        HarnessPredicate.stringMatches(harness.getVariant(), variant)
      )
      .addOption('text', options.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text)
      );
  }

  protected button = this.locatorFor('button');

  async click(): Promise<void> {
    return (await this.button()).click();
  }

  async getText(): Promise<string> {
    return (await this.button()).text();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.button()).matchesSelector(':disabled');
  }

  async isLoading(): Promise<boolean> {
    return (await this.button()).matchesSelector('[aria-busy="true"]');
  }

  async getVariant(): Promise<PdmButtonVariant> {
    const component = await this.getComponentInstance();
    return component.resolvedVariant;
  }

  async getSize(): Promise<PdmButtonSize> {
    const component = await this.getComponentInstance();
    return component.resolvedSize;
  }

  async getType(): Promise<'button' | 'submit' | 'reset'> {
    return (await this.button()).getAttribute('type') as any;
  }

  async hasIcon(): Promise<boolean> {
    const icon = await this.locatorForOptional('[pdmButtonIcon]')();
    return !!icon;
  }

  async focus(): Promise<void> {
    return (await this.button()).focus();
  }

  async blur(): Promise<void> {
    return (await this.button()).blur();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmButtonComponent as any)();
  }
}

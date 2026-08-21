import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmInputComponent } from '../input.component';

export interface PdmInputHarnessFilters {
  selector?: string;
  id?: string;
  placeholder?: string;
}

export class PdmInputHarness extends ComponentHarness {
  static hostSelector = 'pdm-input';

  static with(options: PdmInputHarnessFilters): HarnessPredicate<PdmInputHarness> {
    return new HarnessPredicate(PdmInputHarness, options)
      .addOption('id', options.id, (harness, id) => HarnessPredicate.stringMatches(harness.getId(), id))
      .addOption('placeholder', options.placeholder, (harness, placeholder) =>
        HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder)
      );
  }

  protected input = this.locatorFor('input');

  async getId(): Promise<string> {
    return (await this.input()).getAttribute('id') || '';
  }

  async getValue(): Promise<string> {
    return (await this.input()).getProperty('value') || '';
  }

  async setValue(value: string): Promise<void> {
    const input = await this.input();
    await input.clear();
    await input.sendKeys(value);
  }

  async getPlaceholder(): Promise<string> {
    return (await this.input()).getAttribute('placeholder') || '';
  }

  async isDisabled(): Promise<boolean> {
    return (await this.input()).matchesSelector(':disabled');
  }

  async isReadonly(): Promise<boolean> {
    return (await this.input()).matchesSelector('[readonly]');
  }

  async isRequired(): Promise<boolean> {
    return (await this.input()).matchesSelector('[required]');
  }

  async isInvalid(): Promise<boolean> {
    return (await this.input()).matchesSelector('[aria-invalid="true"]');
  }

  async getLabel(): Promise<string | null> {
    const label = await this.locatorForOptional('label')();
    return label ? label.text() : null;
  }

  async getHelperText(): Promise<string | null> {
    const helper = await this.locatorForOptional('[class*="text-muted-foreground"]')();
    return helper ? helper.text() : null;
  }

  async getErrorText(): Promise<string | null> {
    const error = await this.locatorForOptional('[class*="text-destructive"]')();
    return error ? error.text() : null;
  }

  async focus(): Promise<void> {
    return (await this.input()).focus();
  }

  async blur(): Promise<void> {
    return (await this.input()).blur();
  }

  async getType(): Promise<string> {
    return (await this.input()).getAttribute('type') || 'text';
  }

  async clear(): Promise<void> {
    return (await this.input()).clear();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmInputComponent as any)();
  }
}

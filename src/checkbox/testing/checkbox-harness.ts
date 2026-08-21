import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmCheckboxComponent, PdmCheckboxVariant } from '../checkbox.component';

export interface PdmCheckboxHarnessFilters {
  selector?: string;
  label?: string;
}

export class PdmCheckboxHarness extends ComponentHarness {
  static hostSelector = 'pdm-checkbox';

  static with(options: PdmCheckboxHarnessFilters): HarnessPredicate<PdmCheckboxHarness> {
    return new HarnessPredicate(PdmCheckboxHarness, options)
      .addOption('label', options.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label)
      );
  }

  protected input = this.locatorFor('input[type="checkbox"]');

  async isChecked(): Promise<boolean> {
    return (await this.input()).matchesSelector(':checked');
  }

  async toggle(): Promise<void> {
    return (await this.input()).click();
  }

  async check(): Promise<void> {
    if (!(await this.isChecked())) {
      await this.toggle();
    }
  }

  async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.toggle();
    }
  }

  async isDisabled(): Promise<boolean> {
    return (await this.input()).matchesSelector(':disabled');
  }

  async getLabel(): Promise<string> {
    const label = await this.locatorForOptional('label')();
    return label ? label.text() : '';
  }

  async getDescription(): Promise<string> {
    const component = await this.getComponentInstance();
    return component.description;
  }

  async getVariant(): Promise<PdmCheckboxVariant> {
    const component = await this.getComponentInstance();
    return component.variant;
  }

  async focus(): Promise<void> {
    return (await this.input()).focus();
  }

  async blur(): Promise<void> {
    return (await this.input()).blur();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmCheckboxComponent as any)();
  }
}

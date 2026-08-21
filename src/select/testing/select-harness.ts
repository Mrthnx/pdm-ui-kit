import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmSelectComponent, PdmSelectOption } from '../select.component';

export interface PdmSelectHarnessFilters {
  selector?: string;
  placeholder?: string;
}

export class PdmSelectHarness extends ComponentHarness {
  static hostSelector = 'pdm-select';

  static with(options: PdmSelectHarnessFilters): HarnessPredicate<PdmSelectHarness> {
    return new HarnessPredicate(PdmSelectHarness, options)
      .addOption('placeholder', options.placeholder, (harness, placeholder) =>
        HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder)
      );
  }

  protected trigger = this.locatorFor('button');
  protected panel = this.locatorForOptional('.cdk-overlay-pane');

  async open(): Promise<void> {
    return (await this.trigger()).click();
  }

  async close(): Promise<void> {
    // Close by pressing Escape
    return (await this.trigger()).sendKeys('Escape');
  }

  async isOpen(): Promise<boolean> {
    try {
      const component = await this.getComponentInstance();
      return component.open;
    } catch {
      return false;
    }
  }

  async getSelectedOption(): Promise<PdmSelectOption | undefined> {
    const component = await this.getComponentInstance();
    return component.selectedOption;
  }

  async getSelectedLabel(): Promise<string> {
    const component = await this.getComponentInstance();
    return component.selectedLabel;
  }

  async getPlaceholder(): Promise<string> {
    const component = await this.getComponentInstance();
    return component.placeholder;
  }

  async selectOption(value: string): Promise<void> {
    await this.open();

    const options = await this.locatorForAll('.cdk-overlay-pane button')();
    for (const option of options) {
      const text = await option.text();
      if (text.includes(value)) {
        return option.click();
      }
    }

    throw new Error(`Option with value "${value}" not found`);
  }

  async getOptions(): Promise<PdmSelectOption[]> {
    const component = await this.getComponentInstance();
    return component.resolvedOptions;
  }

  async isDisabled(): Promise<boolean> {
    const component = await this.getComponentInstance();
    return component.disabled;
  }

  async isInvalid(): Promise<boolean> {
    const component = await this.getComponentInstance();
    return component.invalid;
  }

  async focus(): Promise<void> {
    return (await this.trigger()).focus();
  }

  async blur(): Promise<void> {
    return (await this.trigger()).blur();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmSelectComponent as any)();
  }
}

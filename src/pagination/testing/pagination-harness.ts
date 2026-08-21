import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { PdmPaginationComponent } from '../pagination.component';

export interface PdmPaginationHarnessFilters {
  selector?: string;
}

export class PdmPaginationHarness extends ComponentHarness {
  static hostSelector = 'pdm-pagination';

  static with(options: PdmPaginationHarnessFilters): HarnessPredicate<PdmPaginationHarness> {
    return new HarnessPredicate(PdmPaginationHarness, options);
  }

  protected nav = this.locatorFor('nav');

  async goToPage(page: number): Promise<void> {
    const buttons = await this.locatorForAll('button')();

    for (const button of buttons) {
      const text = await button.text();
      if (text.trim() === String(page)) {
        return button.click();
      }
    }

    throw new Error(`Page ${page} not found in pagination`);
  }

  async goToNextPage(): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length > 0) {
      return buttons[buttons.length - 1].click();
    }
  }

  async goToPreviousPage(): Promise<void> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length > 0) {
      return buttons[0].click();
    }
  }

  async getCurrentPage(): Promise<number> {
    const component = await this.getComponentInstance();
    return component.page;
  }

  async getPageCount(): Promise<number> {
    const component = await this.getComponentInstance();
    return component.pageCount;
  }

  async getRowsPerPage(): Promise<number> {
    const component = await this.getComponentInstance();
    return component.rowsPerPage;
  }

  async setRowsPerPage(rows: number): Promise<void> {
    // This would require interacting with the select component
    const component = await this.getComponentInstance();
    component.rowsPerPageChange.emit(rows);
  }

  async getVisiblePages(): Promise<(number | string)[]> {
    const component = await this.getComponentInstance();
    return component.visiblePages;
  }

  async isNextPageDisabled(): Promise<boolean> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length > 0) {
      return buttons[buttons.length - 1].matchesSelector(':disabled');
    }
    return true;
  }

  async isPreviousPageDisabled(): Promise<boolean> {
    const buttons = await this.locatorForAll('button')();
    if (buttons.length > 0) {
      return buttons[0].matchesSelector(':disabled');
    }
    return true;
  }

  async getPageButtons(): Promise<any[]> {
    return this.locatorForAll('button')();
  }

  protected getComponentInstance(): Promise<any> {
    return this.locatorFor(PdmPaginationComponent as any)();
  }
}

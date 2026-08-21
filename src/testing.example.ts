/**
 * Example: How to use PDM UI Kit test harnesses
 *
 * These examples show how to write tests using CDK ComponentHarness
 * for PDM UI Kit components.
 */

// ============================================================================
// Example 1: Testing PdmInputHarness
// ============================================================================

/**
describe('PdmInputComponent with Harness', () => {
  let fixture: ComponentFixture<YourComponent>;
  let harness: PdmInputHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdmInputModule],
    }).compileComponents();

    fixture = TestBed.createComponent(YourComponent);
    harness = await fixture.debugElement.query(
      By.directive(PdmInputComponent)
    ).componentInstance;
  });

  it('should set and get input value', async () => {
    const inputHarness = await loader.getHarness(PdmInputHarness);

    await inputHarness.setValue('test value');
    expect(await inputHarness.getValue()).toBe('test value');
  });

  it('should show error text when invalid', async () => {
    const inputHarness = await loader.getHarness(PdmInputHarness);

    // Set invalid state programmatically
    component.inputInvalid = true;
    fixture.detectChanges();

    expect(await inputHarness.isInvalid()).toBe(true);
    expect(await inputHarness.getErrorText()).toBeTruthy();
  });

  it('should link aria-describedby correctly', async () => {
    const inputHarness = await loader.getHarness(PdmInputHarness);

    const id = await inputHarness.getId();
    expect(id).toBeTruthy();

    const helpText = await inputHarness.getHelperText();
    expect(helpText).toBeTruthy();
  });
});
*/

// ============================================================================
// Example 2: Testing PdmButtonHarness
// ============================================================================

/**
describe('PdmButtonComponent with Harness', () => {
  it('should click and emit event', async () => {
    const loader = TestBed.inject(HarnessLoader);

    const buttonHarness = await loader.getHarness(PdmButtonHarness);

    expect(await buttonHarness.isDisabled()).toBe(false);
    await buttonHarness.click();

    expect(await buttonHarness.getText()).toContain('expected text');
  });

  it('should show loading state', async () => {
    const loader = TestBed.inject(HarnessLoader);
    component.loading = true;
    fixture.detectChanges();

    const buttonHarness = await loader.getHarness(PdmButtonHarness);
    expect(await buttonHarness.isLoading()).toBe(true);
    expect(await buttonHarness.isDisabled()).toBe(true);
  });
});
*/

// ============================================================================
// Example 3: Testing PdmSelectHarness
// ============================================================================

/**
describe('PdmSelectComponent with Harness', () => {
  it('should open and select option', async () => {
    const loader = TestBed.inject(HarnessLoader);
    const selectHarness = await loader.getHarness(PdmSelectHarness);

    expect(await selectHarness.isOpen()).toBe(false);

    await selectHarness.open();
    expect(await selectHarness.isOpen()).toBe(true);

    await selectHarness.selectOption('Option 1');
    expect(await selectHarness.getSelectedLabel()).toContain('Option 1');
  });

  it('should display placeholder when no selection', async () => {
    const loader = TestBed.inject(HarnessLoader);
    const selectHarness = await loader.getHarness(PdmSelectHarness);

    expect(await selectHarness.getSelectedLabel()).toBe('Choose an option');
  });
});
*/

// ============================================================================
// Example 4: Testing PdmDialogHarness
// ============================================================================

/**
describe('PdmDialogComponent with Harness', () => {
  it('should open and close dialog', async () => {
    const loader = TestBed.inject(HarnessLoader);
    component.isDialogOpen = true;
    fixture.detectChanges();

    const dialogHarness = await loader.getHarness(PdmDialogHarness);

    expect(await dialogHarness.isOpen()).toBe(true);
    expect(await dialogHarness.getTitle()).toBe('Confirm Action');

    await dialogHarness.close();
    fixture.detectChanges();

    expect(await dialogHarness.isOpen()).toBe(false);
  });

  it('should emit action events', async () => {
    const loader = TestBed.inject(HarnessLoader);
    const dialogHarness = await loader.getHarness(PdmDialogHarness);

    spyOn(component.dialog.primaryAction, 'emit');
    await dialogHarness.clickPrimaryAction();

    expect(component.dialog.primaryAction.emit).toHaveBeenCalled();
  });
});
*/

// ============================================================================
// Example 5: Testing PdmCheckboxHarness
// ============================================================================

/**
describe('PdmCheckboxComponent with Harness', () => {
  it('should toggle checkbox state', async () => {
    const loader = TestBed.inject(HarnessLoader);
    const checkboxHarness = await loader.getHarness(PdmCheckboxHarness);

    expect(await checkboxHarness.isChecked()).toBe(false);

    await checkboxHarness.toggle();
    expect(await checkboxHarness.isChecked()).toBe(true);

    await checkboxHarness.toggle();
    expect(await checkboxHarness.isChecked()).toBe(false);
  });

  it('should disable checkbox', async () => {
    const loader = TestBed.inject(HarnessLoader);
    component.disabled = true;
    fixture.detectChanges();

    const checkboxHarness = await loader.getHarness(PdmCheckboxHarness);
    expect(await checkboxHarness.isDisabled()).toBe(true);
  });
});
*/

// ============================================================================
// Example 6: Testing PdmPaginationHarness
// ============================================================================

/**
describe('PdmPaginationComponent with Harness', () => {
  it('should navigate pages', async () => {
    const loader = TestBed.inject(HarnessLoader);
    const paginationHarness = await loader.getHarness(PdmPaginationHarness);

    expect(await paginationHarness.getCurrentPage()).toBe(1);

    await paginationHarness.goToPage(3);
    expect(await paginationHarness.getCurrentPage()).toBe(3);

    await paginationHarness.goToNextPage();
    expect(await paginationHarness.getCurrentPage()).toBe(4);

    await paginationHarness.goToPreviousPage();
    expect(await paginationHarness.getCurrentPage()).toBe(3);
  });

  it('should disable navigation at boundaries', async () => {
    const loader = TestBed.inject(HarnessLoader);
    component.page = 1;
    fixture.detectChanges();

    const paginationHarness = await loader.getHarness(PdmPaginationHarness);
    expect(await paginationHarness.isPreviousPageDisabled()).toBe(true);
  });
});
*/

// ============================================================================
// Setup Instructions
// ============================================================================

/**
 * To use these harnesses in your tests:
 *
 * 1. Import the harness and HarnessLoader:
 *    import { PdmInputHarness } from 'pdm-ui-kit/testing';
 *    import { HarnessLoader } from '@angular/cdk/testing';
 *
 * 2. Inject HarnessLoader in beforeEach:
 *    let loader: HarnessLoader;
 *
 *    beforeEach(async () => {
 *      await TestBed.configureTestingModule({
 *        imports: [PdmInputModule],
 *      }).compileComponents();
 *
 *      fixture = TestBed.createComponent(YourComponent);
 *      loader = TestBed.inject(HarnessLoader);
 *    });
 *
 * 3. Use the harness in your tests:
 *    const harness = await loader.getHarness(PdmInputHarness);
 *    await harness.setValue('test');
 *
 * For environment setup, use TestbedHarnessEnvironment for unit tests:
 *    import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
 *
 *    beforeEach(() => {
 *      // ... TestBed config ...
 *      fixture = TestBed.createComponent(YourComponent);
 *      harnessEnvironment = TestbedHarnessEnvironment.loader(fixture);
 *    });
 */

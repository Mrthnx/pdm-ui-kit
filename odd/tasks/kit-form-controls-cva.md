# Kit form controls — reactive forms support (K10)

Additive, non-breaking API extension of `pdm-ui-kit` requested by the `pdmdirector` consumer app (Angular 16.2.12, pdm-ui-kit 1.8.5, 100% reactive-forms on a shared `AppFormControl`/`AppFormGroup` wrapper). Target release: **1.10.0** (minor).

## Specs

### S1 (K10) — `ControlValueAccessor` on the kit form controls

> Implement ControlValueAccessor on the kit form controls, or expose a formControl input, so a consumer can bind [formControl] directly.

Why (verbatim):

> Without CVA the kit cannot be used with reactive forms, which forces every consumer to duplicate the value plumbing and makes validation state impossible to express through the kit component. This is the single biggest blocker to adopting pdm-textarea and pdm-checkbox in this app: today those two are still raw <textarea> and raw <input class="bx--checkbox"> only because the kit components cannot be bound to a FormControl.

Scope (verbatim from the peer message):

> "component":"pdm-input, pdm-textarea, pdm-checkbox, pdm-switch, pdm-select"

Accepted API: `pdm-input`, `pdm-textarea`, `pdm-checkbox`, `pdm-switch`, `pdm-select` and `pdm-native-select` implement `ControlValueAccessor` and register themselves as `NG_VALUE_ACCESSOR` (`useExisting: forwardRef(() => Component), multi: true`). `[formControl]`, `[formControlName]` and `[(ngModel)]` bind directly, with no change to the existing `value`/`valueChange` and `checked`/`checkedChange` surface.

### S2 — model/view contract of the accessor

- `writeValue(v)` writes the model value into the component **without** emitting back to the model (`valueChange`/`checkedChange` must not fire).
- User-originated changes are propagated to the model through `registerOnChange` and keep the existing output (`valueChange` / `checkedChange`) firing exactly once per change.
- `setDisabledState(isDisabled)` maps the model disabled state onto the component `disabled` input.
- `registerOnTouched` is notified on blur (every control has a blur source: native input/textarea/select, button for checkbox/switch/select trigger).
- The DOM value must always converge to the model value, including after a form reset (the user typed into the field, the model value did not change → the value binding alone would not rewrite the DOM).
- `pdm-input` keeps its `debounceMs` semantics: with `debounceMs > 0` the model receives the debounced value (same instant as `valueChange`).

### S3 — no breaking change

- Existing usage (`[value]` + `(valueChange)`, `[checked]` + `(checkedChange)`) keeps working exactly as before, with and without a forms directive.
- No public export is removed, renamed or retyped.
- New peer dependency: `@angular/forms` (`>=15.0.0`), matching the kit's existing Angular peer range.

### S4 — validation state

> "makes validation state impossible to express through the kit component"

The kit keeps the existing `invalid` / `errorText` inputs as the single source of the invalid visual state, so a reactive control expresses it explicitly:

```html
<pdm-input [formControl]="ctrl" [invalid]="ctrl.invalid && ctrl.touched" [errorText]="ctrl.errorText?.required ? 'Requerido' : ''"></pdm-input>
```

The kit does **not** add hidden validators: the consumer's own validators stay the only source of truth for validity.

### S5 — documentation

`README.md` and `USAGE.md` document the reactive-forms usage of each control, the validation-state pattern, the `debounceMs` interaction and the new `@angular/forms` peer requirement.

### S6 — peer answer

The kit answers `pdmdirector` over the agent mesh with the landed set, the target version, the adoption steps and the K1/K2 status (already shipped in 1.9.0).

## Tasks

- T1 (S2) — shared `PdmControlValueAccessor` base in `src/utils/control-value-accessor.ts` + `@angular/forms` peer dependency — inline — commit: `feat(forms): add shared ControlValueAccessor base and forms peer dependency`
- T2 (S1, S2) — `pdm-input` + `pdm-textarea` — worker — commit: `feat(input): support reactive forms via ControlValueAccessor`
- T3 (S1, S2) — `pdm-checkbox` + `pdm-switch` — worker — commit: `feat(checkbox): support reactive forms via ControlValueAccessor`
- T4 (S1, S2) — `pdm-select` + `pdm-native-select` — worker — commit: `feat(select): support reactive forms via ControlValueAccessor`
- T5 (S3, S4, S5) — build verification, regression review, README/USAGE docs, version bump — inline — commit: `docs(forms): document reactive forms support and bump 1.10.0`
- T6 (S6) — reply to `pdmdirector` over the agent mesh — inline — no commit

## Log

- L1 — Original request from `pdmdirector` (verbatim):

```json
{"type":"kit-modernization-requirements","from":"pdmdirector consumer app (Angular 16.2.12, pdm-ui-kit 1.8.5)","subject":"K10 follow-up: kit form controls do not support reactive formControl","priority":"medium-high","context":"While implementing the validation layer on the consumer side we hit a structural gap: pdm-input, pdm-textarea, pdm-checkbox, pdm-switch and pdm-select expose only value/valueChange (or checked/checkedChange) and none of them implement ControlValueAccessor. The consumer is 100% reactive-forms (28 forms built on a shared AppFormControl/AppFormGroup wrapper), so every one of those controls has to be bridged manually with [value] + (valueChange) and cannot use [formControl].","requirement":{"id":"K10","component":"pdm-input, pdm-textarea, pdm-checkbox, pdm-switch, pdm-select","ask":"Implement ControlValueAccessor on the kit form controls, or expose a formControl input, so a consumer can bind [formControl] directly.","why":"Without CVA the kit cannot be used with reactive forms, which forces every consumer to duplicate the value plumbing and makes validation state impossible to express through the kit component. This is the single biggest blocker to adopting pdm-textarea and pdm-checkbox in this app: today those two are still raw <textarea> and raw <input class=\"bx--checkbox\"> only because the kit components cannot be bound to a FormControl."},"note":"This replaces part of the earlier K3 request context, not K1-K9. K1 (pdm-data-table server-side mode) and K2 (virtualization) remain the highest-value items for us."}
```

- L2 — Scope decision (parent): land CVA on the five components named by the peer plus `pdm-native-select` (the native sibling of `pdm-select`, same cost). `pdm-input-otp`, `pdm-input-password`, `pdm-radio-group`, `pdm-slider` and `pdm-combobox` stay out of this release: the peer does not use them for forms today, and the shared base class is public so they can be extended later without an API break.
- L3 — `pdm-input`, `pdm-textarea` and `pdm-native-select` keep their `[value]` DOM binding; the model value is written imperatively into the native element when the binding alone would not rewrite the DOM (form reset after user input). The internal `value`/`checked` state is **not** re-assigned on user input for `pdm-input`/`pdm-textarea` (that would re-write the DOM value on every keystroke and move the caret to the end); `pdm-checkbox`, `pdm-switch` and `pdm-select` do keep their internal state in sync, which is what the CVA contract requires from them.
- L4 — Validation state: the kit does not read the control's validity (injecting `NgControl` from a value accessor is a circular-DI trap and a component-level `Validator` cannot observe sibling validators' errors). The explicit `[invalid]` binding is the supported pattern (S4).
- L5 — Verification baseline: the kit ships no test runner (`node_modules` has no jest/karma/jasmine/vitest), so the applicable verification is `npm run build` (ng-packagr) plus a manual API/behavior review of the diff against 1.9.1. Adding a test framework is out of scope for this feature (same decision as L3 of the 1.9.0 feature).
- L6 — New peer dependency `@angular/forms` (`>=15.0.0`): the `NG_VALUE_ACCESSOR` token is a runtime value of `@angular/forms`, so the package must be installed. Angular CLI projects already depend on it.
- L7 — Work-unit commits on `feature/kit-form-controls-cva`: `4ea6aa8` shared base + forms peer dependency, `8a0a7af` base accessor callback rename, `53e056c` input + textarea, `efe1f3d` checkbox + switch, `364efb5` select + native-select, `cd39edc` docs + version bump. **Slice boundary**: the branch reached ~450 authored changed lines after the component units (past the ~400-line reviewable-slice guideline) and ~560 with the docs; the docs/release slice closes the feature, so the branch was NOT pushed and no PR was opened — merging and publishing stay human decisions.
- L8 — Parent corrections applied to the delegated work: (a) the base class fields were renamed `onChange`/`onTouched` → `onChangeFn`/`onTouchedFn` because `PdmSelectComponent` and `PdmNativeSelectComponent` already expose a public `onChange(event)` DOM handler (a base field with the same name is a hard TS error and would shadow the prototype method); the public `onChange` method of both components was preserved; (b) every component now imports the base class through the established deep entry-point path `pdm-ui-kit/src/utils` instead of a relative path into another entry point's folder (a relative import would have duplicated the base class inside each secondary entry point's FESM).
- L9 — Verification: `npm run build` (ng-packagr) green, and the compiled output registers the `NG_VALUE_ACCESSOR` provider on all six components (`dist/pdm-ui-kit/fesm2020/pdm-ui-kit-src-{input,checkbox,switch,select,native-select}.mjs`). `npm run verify-publish-target` green for 1.10.0.
- L10 — Behavioural verification without a test framework: the six components were compiled with `tsc` and exercised against the real Angular injector (a `ChangeDetectorRef` stub provided through `Injector.create`, no DOM required) with a purpose-built harness that asserts the CVA contract per control — `writeValue` updates the state and emits **nothing** to the model or to the output, a user change notifies the model exactly once and emits the existing output exactly once with the same value, blur marks the control as touched, `setDisabledState` drives the `disabled` input, and `pdm-input`'s `debounceMs` delivers the debounced value to the model while a programmatic write cancels an in-flight debounce. 52/52 checks passed. The harness lives outside the repository (it needs a temporary `tsc` output); adding a permanent test runner is out of scope (L5).
- L11 — Known behavioural nuances (additive, documented): (a) `pdm-checkbox`, `pdm-switch` and `pdm-select` now keep their internal `checked`/`value` in sync on a user change — required by the CVA contract, since Angular Forms does not call `writeValue` back after `onChange`; a consumer that binds `[checked]`/`[value]` one-way and ignores the output will now see the visual state follow the user's interaction; (b) `pdm-select` used inside `pdm-pagination` shows the user's pick even if the host ignores `rowsPerPageChange` (the host is expected to update `rowsPerPage`); (c) `pdm-input`/`pdm-textarea` do NOT re-assign their internal `value` while typing (that would rewrite the DOM value on every keystroke and move the caret to the end) — the model value is written into the native element imperatively instead, so a form reset always converges the DOM.
- L12 — Delivery: the feature branch is ready (build + verification green, 1.10.0). Merging into `master` and publishing to npm remain explicit human steps.
- L13 — Peer answer sent over the agent mesh (T6): `pdmdirector` received the landed set (K10 in 1.10.0, K1-K9 in 1.9.0), the per-item adoption steps, the new `@angular/forms` peer requirement, the validation-state pattern and the behavioural notes; it was told to hold the kit-dependent consumer tasks until 1.10.0 is published.
- L14 — Independent verification (native `assess` plan: writer self-verification + independent verifier, because the escalation named Task Size high-risk item 3). The verifier returned **no blockers**: S1 PASS (provider registered in source and in every built FESM), S2 PASS (79/79 independent runtime checks against the built classes), S3 PASS on the public surface (no member removed, renamed or retyped; the base class only adds members), S5 PASS (`@angular/forms` is a peer dependency, never a runtime dependency; 6 runtime `NG_VALUE_ACCESSOR` token imports + 1 type-only import; exact exposure = the root bundle and the five control entry points at runtime, `pdm-ui-kit/utils` and the six component `.d.ts` at type level).
- L15 — Two concerns raised by the independent verifier, both fixed in the same slice: (a) **DOC GAP** — the behavioural delta (`pdm-checkbox`/`pdm-switch`/`pdm-select` now keep their internal `checked`/`value` in sync on a user interaction) was only recorded in this log; it is now stated in `README.md` and `USAGE.md`. (b) **REGRESSION in an in-kit consumer** — `pdm-pagination` binds `pdm-select` one-way (`[value]="rowsPerPageValue"` + `(valueChange)`) and does not own the value, so a host that ignores `rowsPerPageChange` left the control displaying a rows-per-page the pagination was not using. `PdmPaginationComponent` now re-asserts the authoritative value on the select after the output (`restoreRowsPerPageValue()`), so the control only shows a page size the pagination actually applies. Verified with the same harness style (both rounds: host applies the value → the control shows it; host ignores it → the control falls back to the authoritative value).
- L16 — Left unverified (environmental, not a defect): no DOM-level proof that `FormControlDirective` picks the accessor up (the kit has no test runner and no `jsdom`/`platform-browser-dynamic` available, and installing one was not authorized), and no browser-level proof of the caret/blur behaviour (source and unit-level evidence only).

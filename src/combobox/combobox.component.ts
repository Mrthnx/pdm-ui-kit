import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	Output,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";
import { Overlay, OverlayRef, ConnectedPosition } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
	mergeOverlayPanelClass,
	OVERLAY_BASE_Z_INDEX,
} from "pdm-ui-kit/src/overlay";

@Component({
	selector: "pdm-combobox",
	templateUrl: "./combobox.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmComboboxComponent implements OnDestroy {
	@Input() open = false;
	@Input() placeholder = "Select framework...";
	@Input() searchPlaceholder = "Search framework";
	@Input() className = "";
	@Input() options: string[] = [
		"Next.js",
		"SvelteKit",
		"Nuxt.js",
		"Remix",
		"Astro",
	];
	@Input() value = "";
	@Input() width = 200;
	@Input() panelClassName = "";

	@Output() openChange = new EventEmitter<boolean>();
	@Output() valueChange = new EventEmitter<string>();

	@ViewChild("triggerEl") triggerRef?: ElementRef<HTMLElement>;
	@ViewChild("panelTemplate") panelTemplateRef: any;

	private overlayRef: OverlayRef | null = null;
	private outsideClickSub: any = null;

	constructor(
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.destroyOverlay();
	}

	get selectedLabel(): string {
		return this.value || this.placeholder;
	}

	toggle(): void {
		if (this.open) {
			this.close();
		} else {
			this.openPanel();
		}
	}

	select(option: string): void {
		this.valueChange.emit(option);
		this.value = option;
		this.close();
	}

	@HostListener("document:keydown.escape")
	onEscape(): void {
		if (this.open) {
			this.close();
		}
	}

	private openPanel(): void {
		if (this.overlayRef) return;

		const triggerEl = this.triggerRef?.nativeElement;
		if (!triggerEl) return;

		this.open = true;
		this.openChange.emit(true);
		this.cdr.markForCheck();

		const positionStrategy = this.overlay
			.position()
			.flexibleConnectedTo(triggerEl)
			.withPositions(this.getPositionConfigs())
			.withFlexibleDimensions(false)
			.withPush(true);

		const panelClass = mergeOverlayPanelClass(
			OVERLAY_BASE_Z_INDEX,
			this.panelClassName,
		);

		this.overlayRef = this.overlay.create({
			positionStrategy,
			panelClass,
		});

		const portal = new TemplatePortal(
			this.panelTemplateRef,
			this.viewContainerRef,
		);
		this.overlayRef.attach(portal);

		// Close on click outside
		this.outsideClickSub = this.overlayRef
			.outsidePointerEvents()
			.subscribe(() => {
				this.close();
			});

		this.cdr.markForCheck();
	}

	private close(): void {
		if (!this.overlayRef) return;

		this.open = false;
		this.openChange.emit(false);
		this.cdr.markForCheck();
		this.destroyOverlay();
	}

	private destroyOverlay(): void {
		if (this.outsideClickSub) {
			this.outsideClickSub.unsubscribe();
			this.outsideClickSub = null;
		}
		if (this.overlayRef) {
			this.overlayRef.detach();
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	private getPositionConfigs(): ConnectedPosition[] {
		return [
			{
				originX: "start",
				originY: "bottom",
				overlayX: "start",
				overlayY: "top",
				offsetY: 4,
			},
			{
				originX: "start",
				originY: "top",
				overlayX: "start",
				overlayY: "bottom",
				offsetY: -4,
			},
			{
				originX: "end",
				originY: "bottom",
				overlayX: "end",
				overlayY: "top",
				offsetY: 4,
			},
			{
				originX: "start",
				originY: "bottom",
				overlayX: "end",
				overlayY: "top",
				offsetY: 4,
			},
		];
	}
}

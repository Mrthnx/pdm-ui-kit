import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewContainerRef,
} from "@angular/core";
import { Overlay, OverlayRef, ConnectedPosition } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
	mergeOverlayPanelClass,
	OVERLAY_BASE_Z_INDEX,
} from "../../overlay/z-index-helper";

@Component({
	selector: "pdm-popover",
	templateUrl: "./popover.component.html",
	styles: [":host { display: inline-block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmPopoverComponent implements OnInit, OnDestroy {
	private _open = false;

	@Input() triggerText = "Open";
	@Input() className = "";
	@Input() panelClassName = "";
	@Input() showTrigger = true;

	@Output() openChange = new EventEmitter<boolean>();

	@ViewChild("triggerEl") private triggerRef?: ElementRef<HTMLElement>;
	@ViewChild("panelTemplate") private panelTemplateRef: any;

	private overlayRef: OverlayRef | null = null;
	private outsideClickSub: any = null;

	constructor(
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {}
	ngOnDestroy(): void {
		this.destroyOverlay();
	}

	@Input()
	set open(value: boolean) {
		if (this._open === !!value) return;

		if (value) {
			this.openPanel();
		} else {
			this.closePanel();
		}
	}
	get open(): boolean {
		return this._open;
	}

	toggle(): void {
		this.open = !this.open;
	}

	@HostListener("document:keydown.escape")
	onEsc(): void {
		if (this.open) {
			this.open = false;
			this.openChange.emit(false);
		}
	}

	private openPanel(): void {
		if (this.overlayRef) return;

		const triggerEl = this.triggerRef?.nativeElement;
		if (!triggerEl) return;

		this._open = true;
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
				this.open = false;
				this.openChange.emit(false);
			});

		this.cdr.markForCheck();
	}

	private closePanel(): void {
		if (!this.overlayRef) return;

		this._open = false;
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
			// Bottom (default)
			{
				originX: "start",
				originY: "bottom",
				overlayX: "start",
				overlayY: "top",
				offsetY: 8,
			},
			// Top (fallback)
			{
				originX: "start",
				originY: "top",
				overlayX: "start",
				overlayY: "bottom",
				offsetY: -8,
			},
			// Right
			{
				originX: "end",
				originY: "bottom",
				overlayX: "start",
				overlayY: "top",
				offsetY: 8,
			},
			// Left
			{
				originX: "start",
				originY: "bottom",
				overlayX: "end",
				overlayY: "top",
				offsetY: 8,
			},
		];
	}
}

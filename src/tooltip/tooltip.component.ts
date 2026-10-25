import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
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
	selector: "pdm-tooltip",
	templateUrl: "./tooltip.component.html",
	styles: [
		":host { display: inline-flex; }",
		`
		/* Kit-owned entrance animation.
		 * The kit ships its own keyframes so consumers do not need the
		 * tailwindcss-animate plugin for the tooltip to animate. */
		@keyframes pdm-tooltip-enter {
			from {
				opacity: 0;
				transform: scale(0.96) translateY(-2px);
			}
			to {
				opacity: 1;
				transform: scale(1) translateY(0);
			}
		}

		.pdm-tooltip-panel {
			transform-origin: center;
			animation: pdm-tooltip-enter 140ms cubic-bezier(0.16, 1, 0.3, 1);
		}

		/* Reduced motion: the tooltip must appear instantly, without the
		 * fade/scale entrance. See also the kit-wide reduced-motion block
		 * in src/styles/tokens.css. */
		@media (prefers-reduced-motion: reduce) {
			.pdm-tooltip-panel {
				animation: none !important;
			}
		}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmTooltipComponent implements OnDestroy {
	@Input() text = "";
	@Input() side: "top" | "right" | "bottom" | "left" = "top";
	@Input() className = "";

	@ViewChild("tooltipTemplate") tooltipTemplate: any;

	open = false;
	private overlayRef: OverlayRef | null = null;

	constructor(
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.destroyOverlay();
	}

	@HostListener("mouseenter")
	onMouseEnter(): void {
		this.show();
	}

	@HostListener("mouseleave")
	onMouseLeave(): void {
		this.hide();
	}

	@HostListener("focusin")
	onFocusIn(): void {
		this.show();
	}

	@HostListener("focusout")
	onFocusOut(): void {
		this.hide();
	}

	private show(): void {
		if (this.open || !this.text) return;

		this.open = true;
		this.cdr.markForCheck();
		this.createOverlay();
	}

	private hide(): void {
		if (!this.open) return;

		this.open = false;
		this.cdr.markForCheck();
		this.destroyOverlay();
	}

	private createOverlay(): void {
		if (this.overlayRef) return;

		const triggerEl =
			this.elementRef.nativeElement.querySelector(":scope > *") ||
			this.elementRef.nativeElement;

		const positionStrategy = this.overlay
			.position()
			.flexibleConnectedTo(triggerEl)
			.withPositions(this.getPositionConfigs())
			.withFlexibleDimensions(false)
			.withPush(true);

		const panelClass = mergeOverlayPanelClass(OVERLAY_BASE_Z_INDEX);

		this.overlayRef = this.overlay.create({
			positionStrategy,
			panelClass,
		});

		const portal = new TemplatePortal(
			this.tooltipTemplate,
			this.viewContainerRef,
		);
		this.overlayRef.attach(portal);
	}

	private destroyOverlay(): void {
		if (this.overlayRef) {
			this.overlayRef.detach();
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	private getPositionConfigs(): ConnectedPosition[] {
		const offset = 4;

		switch (this.side) {
			case "bottom":
				return [
					{
						originX: "center",
						originY: "bottom",
						overlayX: "center",
						overlayY: "top",
						offsetY: offset,
					},
					{
						originX: "center",
						originY: "top",
						overlayX: "center",
						overlayY: "bottom",
						offsetY: -offset,
					},
				];
			case "left":
				return [
					{
						originX: "start",
						originY: "center",
						overlayX: "end",
						overlayY: "center",
						offsetX: -offset,
					},
					{
						originX: "end",
						originY: "center",
						overlayX: "start",
						overlayY: "center",
						offsetX: offset,
					},
				];
			case "right":
				return [
					{
						originX: "end",
						originY: "center",
						overlayX: "start",
						overlayY: "center",
						offsetX: offset,
					},
					{
						originX: "start",
						originY: "center",
						overlayX: "end",
						overlayY: "center",
						offsetX: -offset,
					},
				];
			case "top":
			default:
				return [
					{
						originX: "center",
						originY: "top",
						overlayX: "center",
						overlayY: "bottom",
						offsetY: -offset,
					},
					{
						originX: "center",
						originY: "bottom",
						overlayX: "center",
						overlayY: "top",
						offsetY: offset,
					},
				];
		}
	}
}

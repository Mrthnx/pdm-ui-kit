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

export type PdmHoverCardSide = "top" | "right" | "bottom" | "left";
export type PdmHoverCardAlign = "start" | "center" | "end";

@Component({
	selector: "pdm-hover-card",
	templateUrl: "./hover-card.component.html",
	styles: [":host { display: inline-flex; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmHoverCardComponent implements OnDestroy {
	@Input() className = "";
	@Input() panelClassName = "";
	@Input() side: PdmHoverCardSide = "bottom";
	@Input() align: PdmHoverCardAlign = "start";
	@Input() panelWidth = 304;

	open = false;
	private overlayRef: OverlayRef | null = null;
	private showTimeout: any = null;
	private hideTimeout: any = null;

	@ViewChild("panelTemplate") panelTemplateRef: any;

	constructor(
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly elementRef: ElementRef<HTMLElement>,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnDestroy(): void {
		this.clearTimeouts();
		this.destroyOverlay();
	}

	@HostListener("mouseenter")
	onMouseEnter(): void {
		this.clearTimeouts();
		this.showTimeout = setTimeout(() => this.show(), 150);
	}

	@HostListener("mouseleave")
	onMouseLeave(): void {
		this.clearTimeouts();
		this.hideTimeout = setTimeout(() => this.hide(), 150);
	}

	@HostListener("focusin")
	onFocusIn(): void {
		this.clearTimeouts();
		this.show();
	}

	@HostListener("focusout")
	onFocusOut(): void {
		this.clearTimeouts();
		this.hide();
	}

	private clearTimeouts(): void {
		if (this.showTimeout) {
			clearTimeout(this.showTimeout);
			this.showTimeout = null;
		}
		if (this.hideTimeout) {
			clearTimeout(this.hideTimeout);
			this.hideTimeout = null;
		}
	}

	private show(): void {
		if (this.open) return;

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
			this.elementRef.nativeElement.querySelector("[pdmHoverTrigger]") ||
			this.elementRef.nativeElement;

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
	}

	private destroyOverlay(): void {
		if (this.overlayRef) {
			this.overlayRef.detach();
			this.overlayRef.dispose();
			this.overlayRef = null;
		}
	}

	private getPositionConfigs(): ConnectedPosition[] {
		// Map our side/align to CDK positions
		const configs: ConnectedPosition[] = [];

		// Primary position based on side
		switch (this.side) {
			case "top":
				configs.push({
					originX: this.getAlignX(),
					originY: "top",
					overlayX: this.getAlignX(),
					overlayY: "bottom",
					offsetY: -8,
				});
				break;
			case "right":
				configs.push({
					originX: "end",
					originY: this.getAlignY(),
					overlayX: "start",
					overlayY: this.getAlignY(),
					offsetX: 8,
				});
				break;
			case "bottom":
			default:
				configs.push({
					originX: this.getAlignX(),
					originY: "bottom",
					overlayX: this.getAlignX(),
					overlayY: "top",
					offsetY: 8,
				});
				break;
			case "left":
				configs.push({
					originX: "start",
					originY: this.getAlignY(),
					overlayX: "end",
					overlayY: this.getAlignY(),
					offsetX: -8,
				});
				break;
		}

		// Add fallback positions
		switch (this.side) {
			case "top":
			case "bottom":
				configs.push({
					originX: "center",
					originY: this.side === "top" ? "top" : "bottom",
					overlayX: "center",
					overlayY: this.side === "top" ? "bottom" : "top",
					offsetY: this.side === "top" ? -8 : 8,
				});
				break;
			case "left":
			case "right":
				configs.push({
					originX: this.side === "left" ? "start" : "end",
					originY: "center",
					overlayX: this.side === "left" ? "end" : "start",
					overlayY: "center",
					offsetX: this.side === "left" ? -8 : 8,
				});
				break;
		}

		return configs;
	}

	private getAlignX(): "start" | "center" | "end" {
		return this.align;
	}

	private getAlignY(): "top" | "center" | "bottom" {
		// Map 'start'/'end' to 'top'/'bottom' for Y axis
		const alignMap: Record<PdmHoverCardAlign, "top" | "center" | "bottom"> = {
			start: "top",
			center: "center",
			end: "bottom",
		};
		return alignMap[this.align];
	}
}

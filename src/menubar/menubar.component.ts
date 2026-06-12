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
} from "pdm-ui-kit/src/overlay";
import { PdmMenuItem } from "pdm-ui-kit/src/dropdown-menu";

export interface PdmMenubarItem {
	label: string;
	items: PdmMenuItem[];
}

@Component({
	selector: "pdm-menubar",
	templateUrl: "./menubar.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmMenubarComponent implements OnInit, OnDestroy {
	@Input() menus: PdmMenubarItem[] = [];
	@Input() className = "";
	@Input() panelClassName = "";

	@Output() itemSelect = new EventEmitter<string>();

	openIndex = -1;

	@ViewChild("menuTemplate") menuTemplateRef: any;

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

	@HostListener("document:click")
	@HostListener("document:keydown.escape")
	onDocumentClickOrEsc(event: MouseEvent | KeyboardEvent): void {
		// Close on escape
		if (event.type === "keydown") {
			if (this.openIndex >= 0) {
				this.openIndex = -1;
				this.cdr.markForCheck();
			}
			return;
		}

		// Close on click outside
		if (this.openIndex >= 0) {
			const target = event.target as Node;
			if (!this.elementRef.nativeElement.contains(target)) {
				this.openIndex = -1;
				this.cdr.markForCheck();
			}
		}
	}

	toggle(index: number, event: MouseEvent): void {
		event.stopPropagation();
		this.openIndex = this.openIndex === index ? -1 : index;
		this.cdr.markForCheck();

		if (this.openIndex >= 0) {
			this.createOverlay(event);
		} else {
			this.destroyOverlay();
		}
	}

	select(value: string): void {
		this.itemSelect.emit(value);
		this.openIndex = -1;
		this.cdr.markForCheck();
		this.destroyOverlay();
	}

	selectItem(item: PdmMenuItem): void {
		if (item.disabled || !item.value) {
			return;
		}
		this.select(item.value);
	}

	private createOverlay(event: MouseEvent): void {
		this.destroyOverlay();

		const triggerEl = event.currentTarget as HTMLElement;

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
			this.menuTemplateRef,
			this.viewContainerRef,
		);
		this.overlayRef.attach(portal);

		// Close on click outside
		this.outsideClickSub = this.overlayRef
			.outsidePointerEvents()
			.subscribe(() => {
				this.openIndex = -1;
				this.cdr.markForCheck();
				this.destroyOverlay();
			});
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
		];
	}
}

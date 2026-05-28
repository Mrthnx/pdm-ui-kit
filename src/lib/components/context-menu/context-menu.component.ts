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
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
	mergeOverlayPanelClass,
	OVERLAY_BASE_Z_INDEX,
} from "../../overlay/z-index-helper";
import { PdmMenuItem } from "../dropdown-menu/dropdown-menu.component";

export interface PdmContextMenuItem extends PdmMenuItem {
	checked?: boolean;
	selectedDot?: boolean;
}

@Component({
	selector: "pdm-context-menu",
	templateUrl: "./context-menu.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmContextMenuComponent implements OnInit, OnDestroy {
	@Input() items: PdmContextMenuItem[] = [
		{ type: "item", label: "Back", value: "back", inset: true, shortcut: "⌘[" },
		{
			type: "item",
			label: "Forward",
			value: "forward",
			inset: true,
			shortcut: "⌘]",
			disabled: true,
		},
		{
			type: "item",
			label: "Reload",
			value: "reload",
			inset: true,
			shortcut: "⌘R",
		},
		{
			type: "item",
			label: "More Tools",
			value: "more-tools",
			inset: true,
			showChevron: true,
		},
		{ type: "separator" },
		{
			type: "item",
			label: "Show Bookmarks Bar",
			value: "show-bookmarks",
			checked: true,
		},
		{ type: "item", label: "Show Full URLs", value: "show-urls", inset: true },
		{ type: "separator" },
		{ type: "label", label: "People" },
		{ type: "separator" },
		{ type: "item", label: "Pedro Duarte", value: "pedro", selectedDot: true },
		{ type: "item", label: "Colm Tuite", value: "colm", inset: true },
	];
	@Input() className = "";
	@Input() triggerLabel = "Right click here";
	@Input() width = 300;
	@Input() height = 150;
	@Input() panelClassName = "";

	@Output() itemSelect = new EventEmitter<string>();

	open = false;
	x = 0;
	y = 0;

	@ViewChild("menuTemplate") menuTemplateRef: any;

	private overlayRef: OverlayRef | null = null;
	private outsideClickSub: any = null;

	constructor(
		private readonly overlay: Overlay,
		private readonly viewContainerRef: ViewContainerRef,
		private readonly _elementRef: ElementRef<HTMLElement>,
		private readonly cdr: ChangeDetectorRef,
	) {}

	ngOnInit(): void {}
	ngOnDestroy(): void {
		this.destroyOverlay();
	}

	onContextMenu(event: MouseEvent): void {
		event.preventDefault();
		event.stopPropagation();

		this.x = event.clientX;
		this.y = event.clientY;
		this.open = true;
		this.cdr.markForCheck();

		this.createOverlay();
	}

	select(item: PdmContextMenuItem): void {
		if (
			item.disabled ||
			item.type === "separator" ||
			item.type === "label" ||
			!item.value
		)
			return;
		this.itemSelect.emit(item.value);
		this.open = false;
		this.cdr.markForCheck();
		this.destroyOverlay();
	}

	@HostListener("document:keydown.escape")
	@HostListener("document:click")
	onDocumentClick(event: MouseEvent): void {
		if (this.open && event.type === "click") {
			// Don't close on click inside the menu
			if (
				this.overlayRef &&
				this.overlayRef.overlayElement.contains(event.target as Node)
			) {
				return;
			}
			this.close();
		}
	}

	private createOverlay(): void {
		this.destroyOverlay();

		// Create global position strategy at cursor position
		const positionStrategy = this.overlay
			.position()
			.global()
			.left(`${this.x}px`)
			.top(`${this.y}px`);

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
				this.close();
			});
	}

	private close(): void {
		this.open = false;
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
}

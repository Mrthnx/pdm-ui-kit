import { PositionStrategy } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';

/**
 * Creates a flexible position strategy that automatically adjusts
 * to keep the overlay within the viewport edges.
 *
 * The strategy tries positions in this order:
 * 1. Bottom-left (origin bottom edge, aligns to left)
 * 2. Top-left (origin top edge, aligns to left)
 * 3. Bottom-right (origin bottom edge, aligns to right)
 * 4. Top-right (origin top edge, aligns to right)
 *
 * CDK Overlay will use the first position that fits within the viewport.
 */
export function createFlexiblePositionStrategy(
  overlay: Overlay,
  triggerElement: HTMLElement,
  offset: number = 4
): PositionStrategy {
  return overlay
    .position()
    .flexibleConnectedTo(triggerElement)
    .withPositions([
      // Bottom-left (default) - opens downward from left edge
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: offset
      },
      // Top-left - opens upward from left edge
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -offset
      },
      // Bottom-right - opens downward from right edge
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: offset
      },
      // Top-right - opens upward from right edge
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -offset
      }
    ])
    .withFlexibleDimensions(false)
    .withPush(true);
}

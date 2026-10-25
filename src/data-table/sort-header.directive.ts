import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Direction of the sort applied to a table column.
 *
 * - `ascending`: the column is sorted in ascending order
 * - `descending`: the column is sorted in descending order
 * - `none`: the column is sortable but it is not the active sort column
 */
export type PdmSortDirection = 'ascending' | 'descending' | 'none';

/**
 * Sets the `aria-sort` attribute on a projected `<th>` element.
 *
 * The directive is meant to be applied to header cells rendered by the host
 * application, typically inside `pdm-table`:
 *
 * @example
 * <pdm-table>
 *   <thead>
 *     <tr>
 *       <th pdmSortHeader [sortDirection]="directionFor('name')">Name</th>
 *     </tr>
 *   </thead>
 * </pdm-table>
 */
@Directive({
  selector: 'th[pdmSortHeader]'
})
export class PdmSortHeaderDirective {
  /**
   * Current sort direction of the host column.
   * Reflected as the `aria-sort` attribute of the `<th>` element.
   */
  @Input() sortDirection: PdmSortDirection = 'none';

  @HostBinding('attr.aria-sort')
  get ariaSort(): PdmSortDirection {
    return this.sortDirection;
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Card component - Visual container primitivo
 * 
 * BREAKING CHANGE en v0.2.0: variant="login" eliminado.
 * Card es ahora un componente UI puro sin lógica de negocio.
 * 
 * Para crear un login form, componer con primitivos:
 * 
 * @example
 * <pdm-card>
 *   <div pdmCardHeader>
 *     <h3 class="text-lg font-semibold">Login</h3>
 *     <p class="text-sm text-muted-foreground">Enter your credentials</p>
 *   </div>
 *   <div pdmCardContent>
 *     <form [formGroup]="form">
 *       <pdm-field>
 *         <pdm-label>Email</pdm-label>
 *         <pdm-input type="email" formControlName="email" />
 *       </pdm-field>
 *       <pdm-field>
 *         <pdm-label>Password</pdm-label>
 *         <pdm-input-password formControlName="password" />
 *       </pdm-field>
 *     </form>
 *   </div>
 *   <div pdmCardFooter>
 *     <pdm-button (click)="onLogin()">Login</pdm-button>
 *   </div>
 * </pdm-card>
 */
@Component({
  selector: 'pdm-card',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmCardComponent {
  @Input() className = '';
}

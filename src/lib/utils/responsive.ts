/**
 * Sistema de responsive utilities para PDM UI Kit
 * 
 * Proporciona constantes, tipos y helpers para manejar responsive design
 * de forma consistente en todos los componentes.
 */

/**
 * Breakpoints estándar de Tailwind CSS
 * Mobile-first approach: los estilos base son para mobile, los breakpoints son MIN-WIDTH
 */
export const BREAKPOINTS = {
  sm: '640px',   // tablet portrait
  md: '768px',   // tablet landscape
  lg: '1024px',  // desktop
  xl: '1280px',  // large desktop
  '2xl': '1536px' // extra large desktop
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Estrategias de overflow para componentes que pueden desbordar
 */
export type OverflowStrategy = 
  | 'auto'        // Scroll automático cuando sea necesario
  | 'scroll'      // Siempre scroll
  | 'hidden'      // Ocultar contenido que desborda
  | 'visible';    // Permitir desbordamiento

/**
 * Estrategias responsive para tablas
 */
export type TableResponsiveStrategy = 
  | 'scroll'      // Scroll horizontal en mobile (default, más simple)
  | 'stack'       // Convertir filas en cards verticales en mobile
  | 'wrap'        // Permitir que el contenido haga wrap
  | 'collapse';   // Colapsar columnas menos importantes en mobile

/**
 * Helper para generar clases responsive de forma programática
 * 
 * @example
 * responsive({ default: 'block', sm: 'flex', lg: 'grid' })
 * // Returns: 'block sm:flex lg:grid'
 */
export function responsive<T extends string>(
  config: Partial<Record<Breakpoint | 'default', T>>
): string {
  const classes: string[] = [];
  
  if (config.default) {
    classes.push(config.default);
  }
  
  (['sm', 'md', 'lg', 'xl', '2xl'] as Breakpoint[]).forEach(bp => {
    if (config[bp]) {
      classes.push(`${bp}:${config[bp]}`);
    }
  });
  
  return classes.join(' ');
}

/**
 * Helper para overflow responsive
 * Maneja el caso común de scroll en mobile, auto en desktop
 * 
 * @example
 * overflowResponsive('x', 'scroll', 'auto')
 * // Returns: 'overflow-x-scroll sm:overflow-x-auto'
 */
export function overflowResponsive(
  axis: 'x' | 'y' | 'both',
  mobile: OverflowStrategy,
  desktop?: OverflowStrategy
): string {
  const axisClass = axis === 'both' ? 'overflow' : `overflow-${axis}`;
  const mobileClass = `${axisClass}-${mobile}`;
  
  if (!desktop || desktop === mobile) {
    return mobileClass;
  }
  
  return `${mobileClass} sm:${axisClass}-${desktop}`;
}

/**
 * Helper para spacing responsive
 * Útil para padding/margin que necesita ajustarse por breakpoint
 * 
 * @example
 * spacingResponsive('px', { default: '4', sm: '6', lg: '8' })
 * // Returns: 'px-4 sm:px-6 lg:px-8'
 */
export function spacingResponsive(
  property: 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl' | 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml',
  values: Partial<Record<Breakpoint | 'default', string>>
): string {
  return responsive(
    Object.entries(values).reduce((acc, [key, value]) => {
      acc[key as Breakpoint | 'default'] = `${property}-${value}` as any;
      return acc;
    }, {} as Record<Breakpoint | 'default', string>)
  );
}

/**
 * Helper para width responsive
 * 
 * @example
 * widthResponsive({ default: 'full', sm: 'auto', lg: '1/2' })
 * // Returns: 'w-full sm:w-auto lg:w-1/2'
 */
export function widthResponsive(
  values: Partial<Record<Breakpoint | 'default', string>>
): string {
  return responsive(
    Object.entries(values).reduce((acc, [key, value]) => {
      acc[key as Breakpoint | 'default'] = `w-${value}` as any;
      return acc;
    }, {} as Record<Breakpoint | 'default', string>)
  );
}

/**
 * Clases comunes para containers responsive
 * Pensadas para wrappers que contienen contenido que puede desbordar
 */
export const RESPONSIVE_CONTAINER = {
  // Container con scroll horizontal en mobile, contenido visible en desktop
  tableWrapper: 'relative w-full overflow-x-auto sm:overflow-x-visible',
  
  // Container con padding negativo en mobile para scroll edge-to-edge
  tableWrapperFullBleed: 'relative w-full -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:overflow-x-visible',
  
  // Container con max-width responsive
  contentWrapper: 'w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl',
  
  // Container para modals/dialogs
  modalWrapper: 'w-full max-w-lg mx-auto px-4 sm:px-0',
  
  // Container para forms
  formWrapper: 'w-full max-w-md mx-auto space-y-4'
} as const;

/**
 * Clases comunes para display responsive
 */
export const RESPONSIVE_DISPLAY = {
  // Ocultar en mobile, mostrar en desktop
  hideOnMobile: 'hidden sm:block',
  
  // Mostrar solo en mobile
  showOnMobile: 'block sm:hidden',
  
  // Stack en mobile, flex en desktop
  stackToFlex: 'flex flex-col sm:flex-row',
  
  // Stack en mobile, grid en desktop
  stackToGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
} as const;

/**
 * Clases para table responsive strategies
 */
export const TABLE_RESPONSIVE = {
  // Scroll horizontal (default, más simple)
  scroll: {
    wrapper: 'relative w-full overflow-x-auto',
    table: 'w-full min-w-full',
    cell: 'whitespace-nowrap'
  },
  
  // Permitir wrap del contenido
  wrap: {
    wrapper: 'relative w-full overflow-x-auto',
    table: 'w-full',
    cell: 'whitespace-normal break-words'
  },
  
  // Stack en mobile (cada fila se convierte en card)
  // Requiere lógica adicional en el componente
  stack: {
    wrapper: 'relative w-full',
    table: 'w-full',
    row: 'block sm:table-row border-b sm:border-b-0',
    cell: 'block sm:table-cell py-2 sm:py-0 before:content-[attr(data-label)] before:font-medium before:inline-block before:w-32 sm:before:content-none'
  },
  
  // Collapse: ocultar columnas menos importantes en mobile
  // Se usa con clases de visibility en las columnas específicas
  collapse: {
    wrapper: 'relative w-full overflow-x-auto',
    table: 'w-full',
    cell: 'whitespace-nowrap',
    // Estas clases se aplican a columnas opcionales
    optionalColumn: 'hidden md:table-cell'
  }
} as const;

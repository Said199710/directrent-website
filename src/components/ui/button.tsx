// Adapted from shadcn/ui (MIT). See third-party/README.md and shadcn-ui.LICENSE.
import * as React from 'react';
type Variant='default'|'outline'|'ghost';
export function buttonStyles(variant:Variant='default',size:'default'|'icon'='default'){
 return ['inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4',
   size==='icon'?'h-10 w-10':'min-h-10 px-4 py-2.5',
   variant==='default'?'bg-brand text-white shadow-sm hover:bg-blue-500':variant==='outline'?'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800':'text-slate-400 hover:bg-slate-800 hover:text-white'].join(' ');
}
export const Button=React.forwardRef<HTMLButtonElement,React.ComponentProps<'button'>&{variant?:Variant;size?:'default'|'icon'}>(function Button({className='',variant='default',size='default',...props},ref){return <button ref={ref} data-slot="button" className={buttonStyles(variant,size)+' '+className} {...props}/>});

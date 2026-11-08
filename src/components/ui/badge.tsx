// Adapted from shadcn/ui (MIT). See third-party/shadcn-ui.LICENSE.
import * as React from 'react';
export function Badge({className='',...props}:React.ComponentProps<'span'>){return <span data-slot="badge" className={'inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium leading-4 text-slate-300 '+className} {...props}/>}

// Adapted from shadcn/ui (MIT). See third-party/shadcn-ui.LICENSE.
import * as React from 'react';
export function Card({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="card" className={'flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm '+className} {...props}/>}
export function CardHeader({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="card-header" className={'space-y-1.5 p-6 sm:p-7 '+className} {...props}/>}
export function CardTitle({className='',...props}:React.ComponentProps<'h2'>){return <h2 data-slot="card-title" className={'text-base font-semibold tracking-tight text-slate-100 '+className} {...props}/>}
export function CardDescription({className='',...props}:React.ComponentProps<'p'>){return <p data-slot="card-description" className={'text-sm leading-6 text-slate-400 '+className} {...props}/>}
export function CardContent({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="card-content" className={'px-6 pb-6 sm:px-7 sm:pb-7 '+className} {...props}/>}

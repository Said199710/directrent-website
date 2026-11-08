"use client";
// Reduced shadcn/ui Sidebar adaptation (MIT); native dialog replaces Sheet.
// See third-party/README.md. Only the slots used by DirectRent are included.
import * as React from 'react';
import {Menu,X} from 'lucide-react';
import {Button} from './button';
type SidebarState={open:boolean;setOpen:(open:boolean)=>void;trigger:React.RefObject<HTMLButtonElement|null>};
const Context=React.createContext<SidebarState|null>(null);
export function useSidebar(){const c=React.useContext(Context);if(!c)throw new Error('SidebarProvider required');return c}
export function SidebarProvider({children}:React.PropsWithChildren){const[open,setOpen]=React.useState(false);const trigger=React.useRef<HTMLButtonElement>(null);return <Context.Provider value={{open,setOpen,trigger}}><div data-slot="sidebar-wrapper" className="min-h-dvh bg-slate-950 text-slate-100">{children}</div></Context.Provider>}
export function Sidebar({children}:React.PropsWithChildren){
 const{open,setOpen,trigger}=useSidebar();const dialog=React.useRef<HTMLDialogElement>(null);
 React.useEffect(()=>{const query=window.matchMedia('(min-width: 1024px)');const resize=()=>{if(query.matches)setOpen(false)};resize();query.addEventListener('change',resize);return()=>query.removeEventListener('change',resize)},[setOpen]);
 React.useEffect(()=>{const node=dialog.current;if(!node)return;if(!open){if(node.open)node.close();return}const previous=document.body.style.overflow;node.showModal();document.body.style.overflow='hidden';node.querySelector<HTMLButtonElement>('[data-drawer-close]')?.focus();node.querySelector<HTMLElement>('nav a[aria-current="page"]')?.scrollIntoView({block:'nearest'});return()=>{if(node.open)node.close();document.body.style.overflow=previous;trigger.current?.focus()}},[open,trigger]);
 return <><aside data-slot="sidebar" aria-label="Admin sidebar" className="fixed inset-y-0 left-0 z-30 hidden w-[272px] flex-col border-r border-slate-800 bg-[#0c1528] lg:flex">{children}</aside>
 <dialog ref={dialog} id="admin-mobile-nav" aria-label="Admin navigation" className="dr-sidebar-dialog fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,calc(100vw-2rem))] max-w-none border-0 bg-[#0c1528] p-0 text-slate-100 shadow-2xl lg:hidden" onClose={()=>setOpen(false)} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)setOpen(false)}}>
 <div className="flex h-full flex-col"><div className="flex items-center justify-between border-b border-slate-800 px-5 py-3"><span className="text-sm font-medium text-slate-400">Navigation</span><Button data-drawer-close type="button" variant="ghost" size="icon" aria-label="Close navigation" onClick={()=>setOpen(false)}><X aria-hidden="true"/></Button></div>{children}</div></dialog></>;
}
export function SidebarTrigger(){const{open,setOpen,trigger}=useSidebar();return <Button ref={trigger} type="button" variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" aria-controls="admin-mobile-nav" aria-expanded={open} onClick={()=>setOpen(true)}><Menu aria-hidden="true"/></Button>}
export function SidebarHeader({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="sidebar-header" className={'shrink-0 p-6 '+className} {...props}/>}
export function SidebarContent({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="sidebar-content" className={'flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-5 '+className} {...props}/>}
export function SidebarFooter({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="sidebar-footer" className={'shrink-0 border-t border-slate-800 p-4 '+className} {...props}/>}
export function SidebarGroup({className='',...props}:React.ComponentProps<'div'>){return <div data-slot="sidebar-group" className={'min-w-0 '+className} {...props}/>}
export function SidebarGroupLabel({className='',...props}:React.ComponentProps<'h2'>){return <h2 data-slot="sidebar-group-label" className={'px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500 '+className} {...props}/>}
export function SidebarMenu({className='',...props}:React.ComponentProps<'ul'>){return <ul data-slot="sidebar-menu" className={'space-y-1 '+className} {...props}/>}
export function SidebarMenuItem(props:React.ComponentProps<'li'>){return <li data-slot="sidebar-menu-item" {...props}/>}

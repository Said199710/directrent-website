"use client";
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {adminApi,isAccessDenial} from './admin-api';
export type Capabilities={super_admin:boolean;staff_role:string;user_id:number;workspace_task_manager:boolean;permissions:string[];landing:string};
export function useCapabilities(){
  const [capabilities,setCapabilities]=useState<Capabilities|null>(null);
  const [error,setError]=useState('');const path=usePathname();
  useEffect(()=>{let live=true;const load=()=>adminApi<Capabilities>('/admin-console/capabilities').then(x=>{if(live){setCapabilities(x);setError('')}}).catch(e=>{if(live){if(isAccessDenial(e))setCapabilities(null);setError(e.message)}});void load();const timer=window.setInterval(()=>{if(document.visibilityState==='visible')void load()},15000);window.addEventListener('focus',load);return()=>{live=false;clearInterval(timer);window.removeEventListener('focus',load)}},[path]);
  return {capabilities,error};
}
export function can(c:Capabilities|null,permission:string){return !!c&&(c.super_admin||c.permissions.includes(permission))}
export async function staffLanding(){return (await adminApi<Capabilities>('/admin-console/capabilities')).landing}

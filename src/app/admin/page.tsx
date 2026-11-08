"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import AdminShell from '@/components/admin/AdminShell';
import {adminApi,isAccessDenial} from '@/lib/admin-api';
import {useCapabilities} from '@/lib/staff-access';
import {DashboardOverview,parseDashboard,type DashboardData,type DashboardState} from '@/components/admin/DashboardOverview';

export default function Dashboard(){return <AdminShell title="Executive Dashboard"><DashboardContent/></AdminShell>}
function DashboardContent(){
 const {capabilities}=useCapabilities();
 const[data,setData]=useState<DashboardData|null>(null),[state,setState]=useState<DashboardState>('loading');
 const request=useRef<AbortController|null>(null),generation=useRef(0);
 const load=useCallback(async()=>{
  request.current?.abort();const controller=new AbortController();request.current=controller;const epoch=++generation.current;
  setData(null);setState('loading');
  try{const value=parseDashboard(await adminApi<unknown>('/admin-console/dashboard',{signal:controller.signal}));if(epoch===generation.current){setData(value);setState('ready')}}
  catch(error){if(epoch===generation.current&&!controller.signal.aborted){setData(null);setState(isAccessDenial(error)?'denied':'error')}}
 },[]);
 useEffect(()=>{void load();return()=>{generation.current++;request.current?.abort()}},[load]);
 return <DashboardOverview data={data} state={state} capabilities={capabilities} onRetry={()=>void load()}/>;
}

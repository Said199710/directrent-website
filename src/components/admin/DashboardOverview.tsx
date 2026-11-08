"use client";
import Link from 'next/link';
import {ArrowUpRight,Building2,CheckCircle2,ClipboardCheck,Landmark,LoaderCircle,RefreshCw,ShieldAlert,TriangleAlert,Users,Wallet} from 'lucide-react';
import {Card,CardHeader,CardTitle,CardDescription,CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {can,type Capabilities} from '@/lib/staff-access';

export type DashboardData={users:{total:number;landlords:number;tenants:number;admins:number};listings:{total:number;pending:number};kyc:{tenant_pending:number;landlord_pending:number};operations:{open_disputes:number;pending_withdrawals:number;security_incidents:number};payments:{total:number;completed_value:number|string}};
export type DashboardState='loading'|'ready'|'error'|'denied';
// Reject incomplete responses instead of displaying missing values as zero.
export function parseDashboard(value:unknown):DashboardData{
 const groups={users:['total','landlords','tenants','admins'],listings:['total','pending'],kyc:['tenant_pending','landlord_pending'],operations:['open_disputes','pending_withdrawals','security_incidents'],payments:['total','completed_value']};
 if(!value||typeof value!=='object')throw Error('Invalid dashboard response');
 for(const [group,fields] of Object.entries(groups))for(const field of fields){
  const item=(value as Record<string,Record<string,unknown>>)[group]?.[field];
  const amount=group==='payments'&&field==='completed_value';
  if(amount?!(typeof item==='number'||typeof item==='string'&&item.trim()!=='')||!Number.isFinite(Number(item)):typeof item!=='number'||!Number.isSafeInteger(item)||item<0)throw Error('Invalid dashboard response');
 }
 return value as DashboardData;
}
const count=(value:number)=>value.toLocaleString('en-TZ');
const money=(value:number|string)=>'TZS '+Number(value).toLocaleString('en-TZ',{maximumFractionDigits:2});
type Props={data:DashboardData|null;state:DashboardState;capabilities:Capabilities|null;onRetry:()=>void};
export function DashboardOverview({data:d,state,capabilities:c,onRetry}:Props){
 const ready=state==='ready'&&d;
 const kyc=d?d.kyc.tenant_pending+d.kyc.landlord_pending:0;
 const metrics=d?[
  {label:'Total users',value:count(d.users.total),detail:'All registered accounts',icon:Users},
  {label:'Landlords',value:count(d.users.landlords),detail:'Registered landlord accounts',icon:Building2},
  {label:'Tenants',value:count(d.users.tenants),detail:'Registered tenant accounts',icon:Users},
  {label:'Properties',value:count(d.listings.total),detail:'All property listings',icon:Building2},
  {label:'Pending KYC',value:count(kyc),detail:'Tenant and landlord cases',icon:ClipboardCheck},
  {label:'Open disputes',value:count(d.operations.open_disputes),detail:'Cases currently open',icon:TriangleAlert},
  {label:'Pending withdrawals',value:count(d.operations.pending_withdrawals),detail:'Requests awaiting processing',icon:Wallet},
  {label:'Payment value',value:money(d.payments.completed_value),detail:'Completed, paid or successful',icon:Landmark},
 ]:[];
 const queues=d?[
  {label:'Property reviews',value:d.listings.pending,href:'/admin/listings',permission:'listings.read'},
  {label:'Tenant KYC',value:d.kyc.tenant_pending,href:'/admin/trust-center',permission:'kyc.read'},
  {label:'Landlord KYC',value:d.kyc.landlord_pending,href:'/admin/trust-center',permission:'kyc.read'},
  {label:'Open disputes',value:d.operations.open_disputes,href:'/admin/disputes',permission:'support.read'},
  {label:'Pending withdrawals',value:d.operations.pending_withdrawals,href:'/admin/withdrawals',permission:'finance.read'},
 ]:[];
 const empty=d&&d.users.total===0&&d.listings.total===0&&kyc===0&&d.payments.total===0&&Number(d.payments.completed_value)===0&&Object.values(d.operations).every(x=>x===0);
 return <div className="space-y-7" data-testid="dashboard-overview">
  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[.16em] text-blue-400">Platform overview</p><h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your operations at a glance</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Accounts, properties and the work that needs your attention.</p></div>{state!=='denied'&&<Button variant="outline" className="self-start sm:shrink-0" onClick={onRetry} disabled={state==='loading'}><RefreshCw className={state==='loading'?'animate-spin':''} aria-hidden="true"/>{state==='loading'?'Refreshing…':'Refresh data'}</Button>}</div>
  {state==='loading'&&<div role="status" aria-label="Loading dashboard" className="space-y-5"><p className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true"/>Loading dashboard data…</p><div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({length:8},(_,i)=><Card key={i} className="h-40 motion-safe:animate-pulse p-6"><div className="h-3 w-24 rounded bg-slate-800"/><div className="mt-6 h-7 w-20 rounded bg-slate-800"/></Card>)}</div></div>}
  {state==='error'&&<Card role="alert" className="!border-red-500/20"><CardHeader><TriangleAlert className="mb-2 h-6 w-6 text-red-300" aria-hidden="true"/><CardTitle>Dashboard unavailable</CardTitle><CardDescription>We couldn’t load the current figures. No totals are shown. Check your connection and try again.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={onRetry}>Retry dashboard</Button></CardContent></Card>}
  {state==='denied'&&<Card role="alert" className="!border-amber-500/20"><CardHeader><ShieldAlert className="mb-2 h-6 w-6 text-amber-300" aria-hidden="true"/><CardTitle>Dashboard access unavailable</CardTitle><CardDescription>Your session or permissions no longer allow these figures. Sign in again or contact your administrator.</CardDescription></CardHeader></Card>}
  {ready&&<>
   {empty&&<p role="status" className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm leading-6 text-blue-200"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true"/>No activity recorded yet. Figures will appear here as accounts and operations are added.</p>}
   <section aria-label="Platform metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({label,value,detail,icon:Icon})=><Card key={label} className="relative overflow-hidden"><div className="p-5 sm:p-6"><div className="mb-5 flex items-center justify-between gap-2"><h3 className="text-xs font-medium text-slate-400">{label}</h3><span className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-2 text-blue-400"><Icon className="h-4 w-4" aria-hidden="true"/></span></div><p data-metric={label} className="break-words text-2xl font-semibold tracking-tight text-slate-100 [overflow-wrap:anywhere] sm:text-[26px]">{value}</p><p className="mt-2 text-[11px] leading-5 text-slate-500">{detail}</p></div></Card>)}</section>
   <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
    <Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><CardTitle>Work awaiting attention</CardTitle><Badge>Current queues</Badge></div><CardDescription>Review workload across properties, identity and operations.</CardDescription></CardHeader><CardContent>
     {queues.every(q=>q.value===0)&&<p role="status" className="mb-4 rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3 text-sm text-emerald-300">No pending work in these queues.</p>}
     <table className="w-full table-fixed text-left text-sm"><caption className="sr-only">Current review queues and permitted destinations</caption><thead className="text-[10px] uppercase tracking-wider text-slate-500"><tr><th scope="col" className="w-[52%] pb-3 font-medium">Queue</th><th scope="col" className="w-[23%] pb-3 text-right font-medium">Count</th><th scope="col" className="w-[25%] pb-3 text-right font-medium">View</th></tr></thead><tbody className="divide-y divide-slate-800">{queues.map(q=><tr key={q.label}><th scope="row" className="break-words py-4 pr-2 font-medium text-slate-300">{q.label}</th><td className="break-words py-4 text-right font-semibold tabular-nums text-slate-100">{count(q.value)}</td><td className="py-4 pl-2 text-right">{can(c,q.permission)?<Link href={q.href} aria-label={'View '+q.label.toLowerCase()} className="inline-flex min-h-9 items-center justify-end gap-1 rounded px-1 text-xs font-medium text-blue-400 hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">View<ArrowUpRight className="hidden h-3 w-3 sm:block" aria-hidden="true"/></Link>:<span className="text-xs text-slate-500" aria-label={'No access to '+q.label.toLowerCase()}>—</span>}</td></tr>)}</tbody></table>
    </CardContent></Card>
    <div className="space-y-5"><Card><CardHeader><CardTitle>Payment summary</CardTitle><CardDescription>Recorded totals, without a date filter.</CardDescription></CardHeader><CardContent><dl className="space-y-5"><div className="flex items-start justify-between gap-4"><dt className="text-sm text-slate-400">Payment records</dt><dd className="break-words text-right font-semibold tabular-nums text-slate-200">{count(d.payments.total)}</dd></div><div className="border-t border-slate-800 pt-4"><dt className="text-sm text-slate-400">Completed payment value</dt><dd className="mt-2 break-words text-xl font-semibold tracking-tight text-emerald-300 [overflow-wrap:anywhere]">{money(d.payments.completed_value)}</dd></div></dl><p className="mt-4 text-xs leading-5 text-slate-500">Includes completed, paid and successful payment records. This is not an available balance.</p></CardContent></Card>
    <Card><CardHeader><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-700 bg-slate-800/60 p-2"><ShieldAlert className="h-4 w-4 text-slate-300" aria-hidden="true"/></span><CardTitle>Security incidents</CardTitle></div></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums text-slate-100">{count(d.operations.security_incidents)}</p><p className="mt-2 text-sm leading-6 text-slate-400">{d.operations.security_incidents===0?'No open security incidents recorded.':'Open incidents recorded in the platform.'}</p></CardContent></Card></div>
   </div><p className="text-xs leading-5 text-slate-500">Figures reflect the latest successful refresh. Access to individual queues depends on your role.</p>
  </>}
 </div>;
}

import {can,type Capabilities} from './staff-access';
export const adminNavigation=[
 {label:'Operations',items:[
  {href:'/admin',label:'Dashboard',permission:'dashboard.read',icon:'dashboard'},
  {href:'/admin/users',label:'Users',permission:'users.read',icon:'users'},
  {href:'/admin/listings',label:'Properties',permission:'listings.read',icon:'properties'},
  {href:'/admin/trust-center',label:'Trust Center',permission:'kyc.read',icon:'trust'},
  {href:'/admin/disputes',label:'Disputes',permission:'support.read',icon:'disputes'},
  {href:'/admin/payments',label:'Payments',permission:'finance.read',icon:'payments'},
  {href:'/admin/withdrawals',label:'Withdrawals',permission:'finance.read',icon:'withdrawals'},
  {href:'/admin/mail',label:'Company inbox',permission:'mail.read',icon:'mail'},
 ]},
 {label:'Workspace',items:[
  {href:'/admin/workspace/messages',label:'Messages',permission:'workspace.messages',icon:'messages'},
  {href:'/admin/workspace/channels',label:'Channels',permission:'workspace.channels',icon:'channels'},
  {href:'/admin/workspace/tasks',label:'Tasks',permission:'workspace.tasks',icon:'tasks'},
  {href:'/admin/workspace/announcements',label:'Announcements',permission:'workspace.announcements',icon:'announcements'},
 ]},
 {label:'Administration',items:[
  {href:'/admin/staff',label:'Staff',permission:'SUPER',icon:'staff'},
  {href:'/admin/roles',label:'Roles & permissions',permission:'SUPER',icon:'roles'},
  {href:'/admin/mail/manage',label:'Mailbox access',permission:'SUPER',icon:'mail-access'},
  {href:'/admin/audit-logs',label:'Audit logs',permission:'SUPER',icon:'audit'},
 ]},
 {label:'Account',items:[{href:'/admin/profile',label:'My Profile',permission:'SELF',icon:'profile'}]},
] as const;
export type NavigationItem=(typeof adminNavigation)[number]['items'][number];
export function canUseRoute(c:Capabilities|null,permission:string){return permission==='SELF'?!!c:permission==='SUPER'?!!c?.super_admin:can(c,permission)}
export function visibleNavigation(c:Capabilities|null){return adminNavigation.map(group=>({...group,items:group.items.filter(item=>canUseRoute(c,item.permission))})).filter(group=>group.items.length>0)}
export function routeForPath(path:string){return adminNavigation.flatMap<NavigationItem>(group=>group.items).filter(item=>path===item.href||item.href!=='/admin'&&path.startsWith(item.href+'/')).sort((a,b)=>b.href.length-a.href.length)[0]}

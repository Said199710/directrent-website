/** Refresh an authorized window from scratch, retaining its oldest loaded boundary.
 * Never merge old private rows: membership/audience changes may remove them. */
export type Identified={id:number};
export type Page<T>={items:T[];next_before_id:number|null};
export async function loadWindow<T extends Identified>(
  load:(before:number|null)=>Promise<Page<T>>, oldest:number|null, current:()=>boolean=()=>true,
){
  let before:number|null=null;const items:T[]=[];const seen=new Set<number>();
  for(;;){
    const page=await load(before);
    if(!current())throw new DOMException('Superseded Workspace request','AbortError');
    for(const row of page.items)if(!seen.has(row.id)){seen.add(row.id);items.push(row)}
    const next=page.next_before_id;
    if(oldest===null||next===null||next<=oldest)return {items,next_before_id:next};
    if(before!==null&&next>=before)throw new Error('Invalid pagination cursor');
    before=next;
  }
}
export function oldestId(rows:Identified[]){return rows.length?Math.min(...rows.map(x=>x.id)):null}
export function appendPage<T extends Identified>(rows:T[],page:T[]){
  const map=new Map(rows.map(row=>[row.id,row]));for(const row of page)map.set(row.id,row);
  return [...map.values()].sort((a,b)=>b.id-a.id);
}
/** Keep the same visible keyed item at the same pixel position across prepends. */
export function preserveScroll(container:HTMLElement|null,preferred:HTMLElement|null=null){
  const top=container?container.getBoundingClientRect().top:0;
  const nodes=()=>Array.from((container||document).querySelectorAll<HTMLElement>('[data-ws-anchor]'));
  // While reading a conversation, new rows in the adjacent list must not
  // move the page. The inner message viewport has its own independent anchor.
  const rect=preferred?.getBoundingClientRect();
  const anchor=rect&&rect.bottom>0&&rect.top<window.innerHeight?preferred:nodes().find(node=>node.getBoundingClientRect().bottom>top);
  const key=anchor?.dataset.wsAnchor;const offset=anchor?.getBoundingClientRect().top;
  const previous=container?container.scrollTop:window.scrollY;
  return ()=>{
    const now=key?nodes().find(node=>node.dataset.wsAnchor===key):undefined;
    const delta=now&&offset!==undefined?now.getBoundingClientRect().top-offset:0;
    // The browser may already have anchored a prepended row. Apply only the
    // remaining pixel delta to its current offset; resetting to the old offset
    // would undo native anchoring and jump back through loaded history.
    if(container)container.scrollTop=now?container.scrollTop+delta:previous;
    else window.scrollTo({left:window.scrollX,top:now?window.scrollY+delta:previous,behavior:'instant'});
  };
}

export type Draft<T>={value:T;revision:number;dirty:boolean};
/** Remote polling cannot change a dirty form or advance its optimistic-lock revision. */
export function reconcileDraft<T>(draft:Draft<T>,value:T,revision:number):Draft<T>{
  return draft.dirty?draft:{value,revision,dirty:false};
}

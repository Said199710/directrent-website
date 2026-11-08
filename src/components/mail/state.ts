/** Prevent a completed old-mailbox action from installing private data in a new view. */
export async function runInMailView<T>(current:()=>boolean,action:()=>Promise<T>,refresh:()=>Promise<void>):Promise<T>{
  const check=()=>{if(!current())throw new DOMException('Mailbox view changed','AbortError')};
  const value=await action();check();await refresh();check();return value;
}
export function emptyMailboxView(){
  return {cid:null,detail:null,rows:[],messages:[],notes:[],drafts:[],outbox:[],editor:null,counts:{},
    cursor:null,messageCursor:null,noteCursor:null,draftCursor:null,outboxCursor:null,
    query:'',search:'',status:'',notice:'',error:''};
}

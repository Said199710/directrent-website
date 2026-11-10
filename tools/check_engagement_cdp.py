"""Chromium CDP browser checks; requires a browser debugging on port 9337."""
import base64,json,time,urllib.request,websocket
page=next(x for x in json.load(urllib.request.urlopen('http://127.0.0.1:9337/json')) if x['type']=='page')
ws=websocket.create_connection(page['webSocketDebuggerUrl'],origin='http://localhost')
seq=0
def call(method,params={}):
 global seq
 seq+=1;ws.send(json.dumps({'id':seq,'method':method,'params':params}))
 while True:
  result=json.loads(ws.recv())
  if result.get('id')==seq:
   assert 'error' not in result,result
   return result.get('result',{})
def js(expression):
 r=call('Runtime.evaluate',{'expression':expression,'returnByValue':True,'awaitPromise':True})
 assert 'exceptionDetails' not in r,r
 return r['result'].get('value')
def wait(expression):
 for _ in range(150):
  if js(expression): return
  time.sleep(.1)
 raise AssertionError(expression)
def shot(path):
 open(path,'wb').write(base64.b64decode(call('Page.captureScreenshot',{'format':'png'})['data']))

call('Page.enable');call('Network.enable')
call('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
base='http://127.0.0.1:3019'
import secrets
nonce=secrets.token_hex(6).translate(str.maketrans('0123456789','abcdefghij'))
feedback_text='SYNTHETIC browser private feedback '+nonce
approved_text='SYNTHETIC garden question for moderation '+nonce
rejected_text='SYNTHETIC rejected question '+nonce
def go(path):
 call('Page.navigate',{'url':base+path});wait('document.readyState === "complete"');time.sleep(.3)
def fetch(path,method='GET',data=None,auth=False):
 options={'method':method,'headers':{'Content-Type':'application/json'}}
 if data is not None:options['body']=json.dumps(data)
 if auth:options['headers']['Authorization']='Bearer '+open('/tmp/directrent-web-preview.token').read().strip()
 return js('(async()=>{const r=await fetch("http://127.0.0.1:8020'+path+'",'+json.dumps(options)+');return {status:r.status,body:await r.json()}})()')
def fill(selector,value):
 js("(()=>{const x=document.querySelector("+json.dumps(selector)+");const p=x.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:x.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(p,'value').set.call(x,"+json.dumps(value)+");x.dispatchEvent(new Event('input',{bubbles:true}));x.dispatchEvent(new Event('change',{bubbles:true}));})()")
def submit():js("document.querySelector('form').requestSubmit()")
def comments():return fetch('/web/properties/901/comments')['body']['items']
def admin():
 go('/admin/website');wait("document.body.innerText.includes('Private feedback')")
go('/feedback');wait("!!document.querySelector('select[name=found]')")
fill('select[name=found]','partly');fill('textarea[name=message]',feedback_text);submit()
wait("document.body.innerText.includes('Your feedback was sent privately')")
print('PASS browser feedback submission',flush=True)
# Local fixture creates a signed synthetic MFA session; production authentication is not bypassed.
js('sessionStorage.setItem("directrent_admin_token",'+json.dumps(open('/tmp/directrent-web-preview.token').read().strip())+')')
admin();wait("document.body.innerText.includes("+json.dumps(feedback_text)+")")
shot('/tmp/directrent-engagement-admin-feedback.png')
print('PASS private feedback visible in authorized admin',flush=True)
go('/properties/901');wait("!!document.querySelector('textarea[name=message]')")
fill('textarea[name=message]',approved_text);submit()
wait("document.body.innerText.includes('Your comment is pending review')")
assert not any(c['message']==approved_text for c in comments())
queue=fetch('/web/admin/submissions?kind=comment',auth=True)['body']['items']
comment_id=next(c['id'] for c in queue if c['message']==approved_text)
for path in ['/web/admin/submissions','/web/admin/stats']:
 assert fetch(path)['status'] in (401,403)
assert fetch(f'/web/admin/comments/{comment_id}','PUT',{'status':'approved'})['status'] in (401,403)
print('PASS pending hidden and unauthorized access/moderation denied',flush=True)
admin();fill('select','comment');wait("document.body.innerText.includes("+json.dumps(approved_text)+")")
js("Array.from(document.querySelectorAll('button')).find(x=>x.innerText==='Approve #"+str(comment_id)+"').click()")
wait("document.body.innerText.includes('approved')")
go('/properties/901');wait("Array.from(document.querySelectorAll('article p')).some(x=>x.innerText==="+json.dumps(approved_text)+")")
shot('/tmp/directrent-engagement-approved.png')
print('PASS browser approval makes comment public on property 901',flush=True)
fill('textarea[name=message]',rejected_text);submit();wait("document.body.innerText.includes('Your comment is pending review')")
queue=fetch('/web/admin/submissions?kind=comment',auth=True)['body']['items']
rejected_id=next(c['id'] for c in queue if c['message']==rejected_text)
admin();fill('select','comment');wait("document.body.innerText.includes("+json.dumps(rejected_text)+")")
js("Array.from(document.querySelectorAll('button')).find(x=>x.innerText==='Reject #"+str(rejected_id)+"').click()")
wait("document.body.innerText.includes('rejected')")
assert not any(c['message']==rejected_text for c in comments())
print('PASS browser rejection stays hidden',flush=True)
before=fetch('/web/admin/stats',auth=True)['body']
go('/');wait("!!document.querySelector('#properties article')")
fill('input[name=location]','Kigamboni');fill('input[name=budget]','400000');submit()
wait("document.querySelector('[role=status]').innerText.includes('No homes match')")
go('/properties/901');wait("!!document.querySelector('textarea[name=message]')")
js("Array.from(document.querySelectorAll('a')).find(x=>x.innerText==='Download options').click()")
wait("location.pathname==='/download'")
# Synthetic store event verifies separate counters without publishing an unverified store URL.
assert fetch('/web/events','POST',{'event':'store_click','target':'google_play'})['status']==201
time.sleep(.4)
after=fetch('/web/admin/stats',auth=True)['body']
for key in ['search','no_results','property_view','app_click','store_click']:
 assert after['events'].get(key,0)>before['events'].get(key,0),(key,before,after)
assert after['installs'] is None
admin();wait("document.body.innerText.includes('store_click')")
shot('/tmp/directrent-engagement-admin-stats.png')
print('PASS browser search/no-results/view/app-click events update aggregates; synthetic store click separate; installs unmeasured',flush=True)
ws.close()

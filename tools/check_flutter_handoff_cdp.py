"""Chromium CDP browser checks; requires a browser debugging on port 9337."""
import base64,json,time,urllib.request,websocket
page=next(x for x in json.load(urllib.request.urlopen('http://127.0.0.1:9337/json')) if x['type']=='page')
ws=websocket.create_connection(page['webSocketDebuggerUrl'],origin='http://localhost')
seq=0
events=[]
def call(method,params={}):
 global seq
 seq+=1;ws.send(json.dumps({'id':seq,'method':method,'params':params}))
 while True:
  result=json.loads(ws.recv())
  if 'method' in result: events.append(result)
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

call('Page.enable');call('Network.enable');call('Network.setBypassServiceWorker',{'bypass':True});call('Network.clearBrowserCache')
call('Emulation.setDeviceMetricsOverride',{'width':1280,'height':1000,'deviceScaleFactor':1,'mobile':False})
call('Page.navigate',{'url':'http://127.0.0.1:3031/'})
wait("location.port==='3031' && !!document.body")
js('localStorage.setItem("flutter.token",JSON.stringify('+json.dumps(open('/tmp/directrent-web-preview.token').read().strip())+'))')
call('Page.navigate',{'url':'about:blank'})
wait("location.href==='about:blank'")
events.clear()
call('Page.navigate',{'url':'http://127.0.0.1:3031/#/properties/901'})
for i in range(300):
 js('document.readyState')
 if any(e.get('method')=='Network.responseReceived' and '/listings/app-detail/901' in e['params']['response']['url'] and e['params']['response']['status']==200 for e in events):break
 time.sleep(.2)
else:raise AssertionError('Flutter route did not load authenticated property 901')
time.sleep(2)
js("document.querySelector('flt-semantics-placeholder')?.click()")
time.sleep(1)
wait("document.body.innerText.includes('SYNTHETIC Kigamboni Preview')")
shot('/tmp/directrent-flutter-shared-property.png')
print('PASS Flutter Chrome runtime requested authenticated property 901 with HTTP 200; screenshot captured')
print(js('document.body.innerText').strip()[:1500])
print(js("JSON.stringify(Array.from(document.querySelectorAll('[role=button]')).map(x=>({text:x.innerText,label:x.getAttribute('aria-label')})))"))
ws.close()

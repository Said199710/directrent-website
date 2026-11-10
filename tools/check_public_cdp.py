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
 r=call('Runtime.evaluate',{'expression':expression,'returnByValue':True})
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
for width,height in [(1440,1000),(390,844),(320,740)]:
 call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':False})
 call('Page.navigate',{'url':'http://127.0.0.1:3019/'})
 wait("!!document.querySelector('#properties article')")
 assert js('document.documentElement.scrollWidth <= innerWidth')
 js("document.querySelector('#properties').scrollIntoView()")
 shot(f'/tmp/directrent-catalog-{width}.png')
 js("document.querySelector('[name=location]').value='Kigamboni';document.querySelector('[name=budget]').value='450000';document.querySelector('form[aria-label]').requestSubmit()")
 wait("!!document.querySelector('#properties article')")
 assert js("document.querySelector('#properties article').innerText.includes('TZS 450,000') && document.querySelector('#properties article').innerText.includes('Verified property')")
 js("document.querySelector('#properties article h3 a').click()")
 wait("location.pathname==='/properties/901' && !!document.querySelector('h1') && document.querySelector('h1').innerText.includes('SYNTHETIC')")
 assert js("!!document.querySelector('a[href=\"/download?property=901\"]')")
 assert js('document.documentElement.scrollWidth <= innerWidth')
 shot(f'/tmp/directrent-property-{width}.png')
 call('Page.navigate',{'url':'http://127.0.0.1:3019/#properties'})
 wait("!!document.querySelector('#properties article')")
 js("document.querySelector('[name=budget]').value='400000';document.querySelector('form[aria-label]').requestSubmit()")
 wait("document.querySelector('[role=status]').innerText.includes('No homes match')")
 call('Network.emulateNetworkConditions',{'offline':False,'latency':1800,'downloadThroughput':1000000,'uploadThroughput':1000000})
 js("document.querySelector('form[aria-label]').requestSubmit()")
 wait("document.querySelector('[role=status]').innerText.includes('Loading homes')")
 wait("document.querySelector('[role=status]').innerText.includes('No homes match')")
 call('Network.emulateNetworkConditions',{'offline':False,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1})
 call('Network.setBlockedURLs',{'urls':['*127.0.0.1:8020/listings/public-web*']})
 js("document.querySelector('form[aria-label]').requestSubmit()")
 wait("document.querySelector('[role=status]').innerText.includes('could not be loaded')")
 call('Network.setBlockedURLs',{'urls':[]})
 js("Array.from(document.querySelectorAll('button')).find(x=>x.innerText==='Try again').click()")
 wait("document.querySelector('[role=status]').innerText.includes('No homes match')")
 if width<1024:
  js("document.querySelector('summary').click()")
  assert js("document.querySelector('nav[aria-label=\"Mobile navigation\"]').getBoundingClientRect().right<=innerWidth")
 assert js("!!document.querySelector('footer a[href=\"/privacy\"]') && !!document.querySelector('footer a[href=\"/terms\"]') && !!document.querySelector('footer a[href=\"/#contact\"]')")
 print(json.dumps({'viewport':[width,height],'search_detail_journey':'passed','loading':'passed','no_results':'passed','failure_retry':'passed','horizontal_overflow':False}),flush=True)
ws.close()

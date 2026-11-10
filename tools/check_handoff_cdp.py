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
for width,height in [(1440,1000),(390,844)]:
 call('Emulation.setDeviceMetricsOverride',{'width':width,'height':height,'deviceScaleFactor':1,'mobile':False})
 if width==390:call('Emulation.setUserAgentOverride',{'userAgent':'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1'})
 call('Page.navigate',{'url':'http://127.0.0.1:3019/properties/901'})
 wait("document.readyState==='complete' && Array.from(document.querySelectorAll('a')).some(x=>x.innerText==='Open in DirectRent')");time.sleep(1)
 js("Array.from(document.querySelectorAll('a')).find(x=>x.innerText==='Open in DirectRent').click()")
 wait("!!document.querySelector('section [role=status]') && document.querySelector('section [role=status]').innerText.length>0")
 assert js("location.pathname==='/properties/901'")
 assert js('document.documentElement.scrollWidth<=innerWidth')
 js("Array.from(document.querySelectorAll('a')).find(x=>x.innerText==='Download options').click()")
 wait("location.pathname==='/download' && location.search==='?property=901' && !!document.querySelector('a[href=\"/properties/901\"]')")
 assert js("!!document.querySelector('a[href=\"https://downloads.directrent.app/directrent-latest.apk\"]')")
 assert js("!Array.from(document.querySelectorAll('a')).some(x=>/play.google.com|apps.apple.com|testflight.apple.com/.test(x.href))")
 assert js("document.body.innerText.includes('not available for download yet')")
 shot(f'/tmp/directrent-download-{width}.png')
 js("document.querySelector('a[href=\"/properties/901\"]').click()")
 wait("location.pathname==='/properties/901' && document.body.innerText.includes('SYNTHETIC Kigamboni Preview')")
 print(f'PASS {width}x{height}: browser retained; property preserved through download options; beta link present; unverified store URLs absent',flush=True)
call('Emulation.setUserAgentOverride',{'userAgent':'Mozilla/5.0 Chrome/130.0 Safari/537.36'})
ws.close()

"""Local review server with HTTP byte ranges for reliable chapter seeking."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import os,re
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(Path(__file__).resolve().parent),**kw)
 def send_head(self):
  self.remaining=None
  path=Path(self.translate_path(self.path));rng=self.headers.get('Range','')
  if path.is_file() and rng:
   match=re.fullmatch(r'bytes=(\d*)-(\d*)',rng)
   if not match:self.send_error(416);return None
   size=path.stat().st_size;a,b=match.groups();start=int(a) if a else max(0,size-int(b));end=min(int(b),size-1) if a and b else size-1
   if start>end or start>=size:self.send_error(416);return None
   f=path.open('rb');f.seek(start);self.remaining=end-start+1
   self.send_response(206);self.send_header('Content-Type',self.guess_type(str(path)));self.send_header('Content-Length',str(self.remaining));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Accept-Ranges','bytes');self.end_headers();return f
  return super().send_head()
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes');super().end_headers()
 def copyfile(self,source,out):
  if self.remaining is None:return super().copyfile(source,out)
  remaining=self.remaining
  while remaining:
   chunk=source.read(min(65536,remaining))
   if not chunk:break
   out.write(chunk);remaining-=len(chunk)
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',8770),Handler).serve_forever()

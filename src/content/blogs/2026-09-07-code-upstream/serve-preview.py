"""Local review server with byte ranges so full-film seeking works."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re


class ReviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        if self.path.split('?', 1)[0].endswith('.html'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def send_head(self):
        self.range_remaining = None
        requested = self.headers.get('Range')
        path = Path(self.translate_path(self.path))
        if not requested or not path.is_file():
            return super().send_head()
        match = re.fullmatch(r'bytes=(\d*)-(\d*)', requested.strip())
        # This player only needs single ranges; ignore unsupported range forms.
        if not match or not any(match.groups()):
            return super().send_head()
        stream = path.open('rb')
        size = path.stat().st_size
        left, right = match.groups()
        if left:
            start = int(left)
            end = min(int(right), size - 1) if right else size - 1
        else:
            start, end = max(0, size - int(right)), size - 1
        if start >= size or start > end:
            stream.close()
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        self.range_remaining = end - start + 1
        stream.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(str(path)))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(self.range_remaining))
        self.send_header('Last-Modified', self.date_time_string(path.stat().st_mtime))
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        try:
            if self.range_remaining is None:
                return super().copyfile(source, outputfile)
            remaining = self.range_remaining
            while remaining:
                chunk = source.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass  # Normal when the viewer seeks or pauses an in-flight request.


if __name__ == '__main__':
    directory = Path(__file__).resolve().parent / 'preview'
    server = ThreadingHTTPServer(('127.0.0.1', 4332), partial(ReviewHandler, directory=str(directory)))
    print(f'Review: http://127.0.0.1:4332/film.html · directory={directory}', flush=True)
    server.serve_forever()

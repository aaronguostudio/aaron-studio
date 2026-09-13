import concurrent.futures
import datetime
import hashlib
import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path('/Users/aaronguo/Work/ag/blog/aaronguoblog-astra-2026-09-06')
BASE = 'https://www.aaronguo.com'
SLUG = 'gpt-6-astra-real-work'

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta, self.links, self.images, self.h1 = {}, [], [], []
        self.in_h1 = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta': self.meta[a.get('property', a.get('name'))] = a.get('content')
        if tag in ('a', 'link'): self.links.append(a)
        if tag == 'img': self.images.append(a)
        if tag == 'h1': self.in_h1 = True
    def handle_endtag(self, tag):
        if tag == 'h1': self.in_h1 = False
    def handle_data(self, text):
        if self.in_h1: self.h1.append(text)

def get(path):
    return subprocess.check_output(['curl', '--fail', '--silent', '--show-error', '--max-time', '30', BASE + path])

def article(lang):
    path = ('' if lang == 'en' else '/zh') + '/blogs/' + SLUG
    p = Page(); html = get(path).decode(); p.feed(html)
    expected = 'I Put GPT-6 Astra to Work' if lang == 'en' else '我把 GPT-6 Astra 用进了真实工作'
    assert ''.join(p.h1).strip() == expected
    assert p.meta['og:title'] == expected
    assert p.meta['og:image'] == BASE + '/blogs-img/2026-09-06-astra-work-cover.webp'
    assert len(p.meta['description']) > 40 and 'no-description' not in p.meta['description']
    assert any(a.get('rel') == 'canonical' and a.get('href') == BASE + path for a in p.links)
    assert any('_12kx0AFhCM' in a.get('href', '') for a in p.links)
    cover = [i for i in p.images if 'astra-work-cover' in i.get('src', '')]
    assert len(cover) == 1
    for suffix in ('01', '02', '03', '04', '05'): assert f'astra-work-{suffix}.webp' in html
    return {'url': BASE + path, 'title': expected, 'cover_count': len(cover), 'description': p.meta['description'], 'youtube_link': True}

def asset(path):
    data = get('/blogs-img/' + path.name)
    digest = hashlib.sha256(data).hexdigest()
    assert digest == hashlib.sha256(path.read_bytes()).hexdigest()
    return {'path': '/blogs-img/' + path.name, 'sha256': digest, 'matches_committed_asset': True}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    articles = list(pool.map(article, ['en', 'zh']))
    assets = list(pool.map(asset, sorted((ROOT / 'public/blogs-img').glob('2026-09-06-astra-work-*.webp'))))
    homes = list(pool.map(get, ['/', '/zh']))
    assert all(SLUG in h.decode() for h in homes)
result = {'checked_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'articles': articles, 'assets': assets, 'homepage_cards': 'present in English and Chinese'}
Path(__file__).with_name('live-blog.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'articles': [x['url'] for x in articles], 'assets_verified': len(assets), 'homepage_cards': True}, indent=2))

#!/usr/bin/env python3
"""Export an explicit, secret-free subset of the canonical tiles. No recursive copies."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[2]
SKILLS = ('paste-ready-update', 'demo-capture', 'walkthrough-video')

def bundle_files(root=ROOT):
    files = {}
    groups = {
        'tiles/paste-ready-update': ['SKILL.md', 'tile.json', 'agents/openai.yaml', 'assets/template.html',
            'scripts/build_page.py', 'scripts/mark_screenshot.py', 'references/walkthrough.md', 'references/guided-demo.md'],
        'tiles/demo-capture': ['SKILL.md', 'tile.json', 'package.json', 'package-lock.json',
            'scripts/cli.mjs', 'scripts/guards.mjs', 'scripts/project.mjs', 'scripts/recorder.mjs', 'scripts/session.mjs'],
        'tiles/walkthrough-video': ['SKILL.md', 'tile.json'],
        'tiles/aaron-video-gen': ['config/voice-profiles.json', 'references/walkthrough-capture.md',
            'scripts/walkthrough/render-walkthrough.ts', 'scripts/walkthrough/narration.ts',
            'scripts/walkthrough/make-fixture.ts', 'remotion/src/projects/walkthrough-video/index.tsx',
            'remotion/src/projects/walkthrough-video/timeline.ts', 'remotion/remotion.config.ts', 'remotion/tsconfig.json'],
        'scripts/demo-tools': ['bundle.py', 'install.py', 'cli.py', 'smoke.mjs', 'requirements.txt',
            'remotion-package.json', 'remotion-package-lock.json'],
        'docs': ['demo-tools-macos.md'],
    }
    for base, names in groups.items():
        for name in names:
            relative = f'{base}/{name}'
            files[relative] = root / relative
    for name in ('package.json', 'package-lock.json'):
        files[f'tiles/aaron-video-gen/remotion/{name}'] = root / 'scripts/demo-tools' / f'remotion-{name}'
    return files

def metadata(root=ROOT):
    hashes = {}
    for destination, source in sorted(bundle_files(root).items()):
        if source.is_symlink() or not source.is_file() or not source.resolve().is_relative_to(root.resolve()):
            raise ValueError(f'Missing or symlinked bundle source: {source}')
        hashes[destination] = hashlib.sha256(source.read_bytes()).hexdigest()
    digest = hashlib.sha256(json.dumps(hashes, sort_keys=True).encode()).hexdigest()
    try:
        revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True, stderr=subprocess.DEVNULL).strip()
        paths = sorted({str(path.relative_to(root)) for path in bundle_files(root).values()})
        dirty = bool(subprocess.check_output(['git', '-C', str(root), 'status', '--porcelain', '--', *paths], text=True).strip())
    except subprocess.CalledProcessError:
        original = root / 'bundle-manifest.json'
        previous = json.loads(original.read_text()) if original.is_file() else {}
        revision = previous.get('sourceRevision', 'exported')
        dirty = previous.get('sourceDirty', True) or previous.get('files') != hashes
    return {'schema': 1, 'id': digest[:16], 'sourceRevision': revision, 'sourceDirty': dirty, 'skills': list(SKILLS), 'files': hashes}

def build(destination, root=ROOT):
    destination = Path(destination).expanduser().absolute()
    if destination.resolve().is_relative_to(root.resolve()):
        raise ValueError('Export outside the Studio checkout.')
    manifest = metadata(root)
    destination.mkdir(parents=True, exist_ok=False)
    for relative, source in bundle_files(root).items():
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
    (destination / 'scripts/demo-tools/cli.py').chmod(0o755)
    (destination / 'bundle-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(build(args.out), indent=2))
    except (ValueError, OSError) as error:
        parser.exit(1, f'bundle: {error}\n')

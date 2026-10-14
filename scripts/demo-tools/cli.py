#!/usr/bin/env python3
"""Commands for the installed demo-only bundle."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
ENGINE = ROOT / 'tiles/demo-capture'
RENDER = ROOT / 'tiles/aaron-video-gen/remotion'

def settings():
    return json.loads((ROOT / 'installed.json').read_text())

def environment(config):
    env = dict(os.environ)
    # Desktop apps may have an older PATH than Terminal. Use the tools checked at install time.
    directories = [str(Path(value).parent) for value in config['tools'].values()]
    env['PATH'] = os.pathsep.join(dict.fromkeys(directories + [env.get('PATH', '')]))
    env['PLAYWRIGHT_BROWSERS_PATH'] = config['playwrightBrowsers']
    return env

def run(command, config, **kwargs):
    return subprocess.run([str(part) for part in command], env=environment(config), **kwargs)

def doctor(config, check_links=True):
    failures = []
    def check(label, command, **kwargs):
        result = run(command, config, capture_output=True, text=True, **kwargs)
        print(f'{"PASS" if result.returncode == 0 else "FAIL"} {label}', flush=True)
        if result.returncode:
            failures.append(label)
            print((result.stderr or result.stdout)[-2000:])
    manifest = json.loads((ROOT / 'bundle-manifest.json').read_text())
    for relative, expected in manifest['files'].items():
        path = ROOT / relative
        if path.is_symlink() or not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            failures.append(f'Bundle file changed or missing: {relative}')
    check('Node >=22', [config['tools']['node'], '-e', 'if(+process.versions.node.split(".")[0]<22)process.exit(1)'])
    check('Python + Pillow', [ROOT / '.venv/bin/python3', '-c', 'from PIL import Image'])
    for name in ('ffmpeg', 'ffprobe'):
        check(name, [config['tools'][name], '-version'])
    check('Pinned Bun', [RENDER / 'node_modules/.bin/bun', '--version'])
    check('Headed Chromium installed + headless Chromium launches', [config['tools']['node'], '--input-type=module', '-e',
        "import {chromium} from 'playwright';import {existsSync} from 'node:fs';"
        "if(!existsSync(chromium.executablePath()))throw Error('Headed Chromium is missing');"
        "const b=await chromium.launch();await b.close()"], cwd=ENGINE)
    check('Remotion browser', [config['tools']['node'], RENDER / 'node_modules/@remotion/cli/remotion-cli.js', 'browser', 'ensure'], cwd=RENDER)
    if check_links:
        for name in manifest['skills']:
            path = Path(config['skillsDir']) / name
            if not path.is_symlink() or path.resolve() != (ROOT / 'tiles' / name).resolve():
                failures.append(f'Codex skill link: {path}')
        executable = Path(config['binDir']) / 'aaron-demo'
        if not executable.is_symlink() or executable.resolve() != (ROOT / 'aaron-demo').resolve():
            failures.append(f'Command link: {executable}')
    for failure in failures:
        print(f'FAIL {failure}', file=sys.stderr)
    if not failures:
        state = ', modified source' if manifest.get('sourceDirty') else ''
        print(f'Demo tools ready: {manifest["id"]} (source {manifest["sourceRevision"]}{state})')
    return bool(failures)

def main():
    args = sys.argv[1:]
    if not args or args[0] in ('--help', '-h'):
        print('Usage: aaron-demo doctor | smoke | capture <args> | render <run> [args] | page <message.md> --out <page.html> | mark <args>')
        return 0
    config = settings()
    command, rest = args[0], args[1:]
    if command == 'doctor':
        return doctor(config)
    commands = {
        'capture': [config['tools']['node'], ENGINE / 'scripts/cli.mjs'],
        'render': [RENDER / 'node_modules/.bin/bun', ROOT / 'tiles/aaron-video-gen/scripts/walkthrough/render-walkthrough.ts'],
        'page': [ROOT / '.venv/bin/python3', ROOT / 'tiles/paste-ready-update/scripts/build_page.py'],
        'mark': [ROOT / '.venv/bin/python3', ROOT / 'tiles/paste-ready-update/scripts/mark_screenshot.py'],
        'smoke': [config['tools']['node'], ROOT / 'scripts/demo-tools/smoke.mjs'],
    }
    if command not in commands:
        print(f'Unknown command: {command}', file=sys.stderr)
        return 2
    return run(commands[command] + rest, config).returncode

if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError) as error:
        print(f'aaron-demo: {error}. Re-run the installer if the installation is incomplete.', file=sys.stderr)
        sys.exit(1)

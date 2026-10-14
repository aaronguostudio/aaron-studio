#!/usr/bin/env python3
"""Install the demo-only bundle on macOS; activate only after verification passes."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import platform
import shutil
import shlex
import subprocess
import sys

from bundle import ROOT, SKILLS, build, metadata

def atomic_link(target, link):
    temporary = link.with_name(link.name + f'.tmp-{os.getpid()}')
    temporary.symlink_to(target)
    try:
        temporary.replace(link)
    finally:
        temporary.unlink(missing_ok=True)

def link_conflicts(root, skills_dir, bin_dir):
    wanted = {skills_dir / name: root / 'current/tiles' / name for name in SKILLS}
    wanted[bin_dir / 'aaron-demo'] = root / 'current/aaron-demo'
    conflicts = [str(path) for path, target in wanted.items()
        if (path.exists() or path.is_symlink()) and (not path.is_symlink() or path.resolve() != target.resolve())]
    if conflicts:
        raise ValueError('Existing skills/command were preserved. Move or rename these entries, then retry:\n' + '\n'.join(conflicts))
    return wanted

def prerequisites():
    if platform.system() != 'Darwin':
        raise ValueError('This installer supports macOS.')
    if sys.version_info < (3, 11):
        raise ValueError('Python >=3.11 is required. Install prerequisites from docs/demo-tools-macos.md.')
    tools = {name: shutil.which(name) for name in ('node', 'npm', 'ffmpeg', 'ffprobe')}
    missing = [name for name, path in tools.items() if not path]
    if missing:
        raise ValueError('Missing prerequisites: ' + ', '.join(missing) + '. See docs/demo-tools-macos.md.')
    version = subprocess.check_output([tools['node'], '-p', 'process.versions.node'], text=True).strip()
    if int(version.split('.')[0]) < 22:
        raise ValueError(f'Node >=22 required; found {version}.')
    tools['python'] = sys.executable
    return tools

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path.home() / '.local/share/aaron-demo-tools')
    parser.add_argument('--skills-dir', type=Path, default=Path.home() / '.agents/skills')
    parser.add_argument('--bin-dir', type=Path, default=Path.home() / '.local/bin')
    args = parser.parse_args()
    tools = prerequisites()
    root, skills_dir, bin_dir = [path.expanduser().resolve() for path in (args.root, args.skills_dir, args.bin_dir)]
    # Never mix an installation with its source tree, a project, or captured work.
    if root.resolve().is_relative_to(ROOT.resolve()):
        raise ValueError('Install outside the source checkout.')
    current = root / 'current'
    if (current.exists() or current.is_symlink()) and not current.is_symlink():
        raise ValueError(f'Preserved existing directory: {current}')
    if current.is_symlink() and not current.resolve().is_relative_to((root / 'releases').resolve()):
        raise ValueError(f'Preserved unrelated current link: {current}')
    wanted = link_conflicts(root, skills_dir, bin_dir)
    source = metadata()
    release = root / 'releases' / source['id']
    if release.is_symlink():
        raise ValueError(f'Preserved unexpected release symlink: {release}')
    if release.exists() and not (release / 'installed.json').exists():
        raise ValueError(f'Incomplete release preserved at {release}. Remove that release directory, then retry.')
    if not release.exists():
        build(release)
        config = {'tools': tools, 'playwrightBrowsers': str(root / 'browsers/playwright'),
            'skillsDir': str(skills_dir), 'binDir': str(bin_dir)}
        (release / 'installed.json').write_text(json.dumps(config, indent=2) + '\n')
    # Identical content can move from a local test to a committed revision without another dependency install.
    manifest_path = release / 'bundle-manifest.json'
    manifest = json.loads(manifest_path.read_text())
    manifest.update(sourceRevision=source['sourceRevision'], sourceDirty=source['sourceDirty'])
    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
    spec = importlib.util.spec_from_file_location('demo_cli', release / 'scripts/demo-tools/cli.py')
    cli = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cli)
    cli.ROOT = release
    cli.ENGINE = release / 'tiles/demo-capture'
    cli.RENDER = release / 'tiles/aaron-video-gen/remotion'
    config = cli.settings()
    # Save machine-local executable paths; no credentials belong here.
    config.update(tools=tools, skillsDir=str(skills_dir), binDir=str(bin_dir))
    (release / 'installed.json').write_text(json.dumps(config, indent=2) + '\n')
    launcher = release / 'aaron-demo'
    launcher.write_text('#!/bin/sh\nexec ' + shlex.quote(tools['python']) + ' ' +
        shlex.quote(str(release / 'scripts/demo-tools/cli.py')) + ' "$@"\n')
    launcher.chmod(0o755)
    # Retry a partially installed release without changing the currently active one.
    def run(command, **kwargs):
        subprocess.run([str(part) for part in command], env=cli.environment(config), check=True, **kwargs)
    if not (release / 'READY').exists():
        for directory in (cli.ENGINE, cli.RENDER):
            run([tools['npm'], 'ci', '--no-audit', '--no-fund'], cwd=directory)
        run([sys.executable, '-m', 'venv', release / '.venv'])
        run([release / '.venv/bin/python3', '-m', 'pip', 'install', '--disable-pip-version-check', '-r', release / 'scripts/demo-tools/requirements.txt'])
    # Browser caches may have been removed after a successful installation. Prepare them on retries too.
    run([tools['node'], cli.ENGINE / 'node_modules/playwright/cli.js', 'install', 'chromium'])
    run([tools['node'], cli.RENDER / 'node_modules/@remotion/cli/remotion-cli.js', 'browser', 'ensure'], cwd=cli.RENDER)
    if cli.doctor(config, check_links=False):
        raise ValueError('Verification failed; previous installation is still active.')
    (release / 'READY').touch()
    # Check again after downloads, before any links change.
    link_conflicts(root, skills_dir, bin_dir)
    for path in (skills_dir, bin_dir):
        path.mkdir(parents=True, exist_ok=True)
    atomic_link(release, current)
    for link, target in wanted.items():
        atomic_link(target, link)
    if cli.doctor(config):
        raise ValueError('Installed files passed, but skill registration needs attention.')
    print(f'Installed. Start a new Codex chat in your application project.\nCommand: {bin_dir / "aaron-demo"}\nSmoke check: {bin_dir / "aaron-demo"} smoke')

if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        sys.exit(f'install: {error}')

"""Observable packaging and registration invariants; no downloads or client access."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import bundle
from install import atomic_link, installation_lock, link_conflicts

class BundleTests(unittest.TestCase):
    def test_export_has_only_allowlisted_plain_files_and_complete_runtime(self):
        with tempfile.TemporaryDirectory(prefix='demo-export-') as directory:
            output = Path(directory) / 'bundle with spaces'
            manifest = bundle.build(output)
            actual = {str(path.relative_to(output)) for path in output.rglob('*') if path.is_file()}
            self.assertEqual(actual, set(manifest['files']) | {'bundle-manifest.json'})
            self.assertFalse(any(path.is_symlink() for path in output.rglob('*')))
            self.assertFalse(any('src/content/' in path or '/build/' in path or '.env' in path for path in actual))
            self.assertFalse((output / 'tiles/aaron-video-gen/SKILL.md').exists())
            package = json.loads((output / 'tiles/aaron-video-gen/remotion/package.json').read_text())
            self.assertEqual(package['dependencies']['remotion'], package['dependencies']['@remotion/cli'])
            self.assertTrue((output / 'tiles/aaron-video-gen/remotion/src/projects/walkthrough-video/index.tsx').exists())
            self.assertEqual(manifest['skills'], ['paste-ready-update', 'demo-capture', 'walkthrough-video'])

    def test_export_never_overwrites_or_exports_into_source(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaises(FileExistsError):
                bundle.build(Path(directory))
        with self.assertRaisesRegex(ValueError, 'outside'):
            bundle.build(bundle.ROOT / 'demo-export')

    def test_registration_preserves_unrelated_entries_including_broken_links(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skills = root / 'skills'
            skills.mkdir()
            (skills / 'demo-capture').symlink_to(root / 'missing')
            with self.assertRaisesRegex(ValueError, 'preserved'):
                link_conflicts(root / 'install', skills, root / 'bin')
            self.assertTrue((skills / 'demo-capture').is_symlink())

    def test_update_switches_only_managed_links_and_handles_spaces(self):
        with tempfile.TemporaryDirectory(prefix='demo tools ') as directory:
            root = Path(directory)
            skills = root / 'skills'; skills.mkdir()
            binaries = root / 'bin'; binaries.mkdir()
            install = root / 'install'
            wanted = link_conflicts(install, skills, binaries)
            for link, target in wanted.items():
                atomic_link(target, link)
            self.assertEqual(link_conflicts(install, skills, binaries), wanted)
            atomic_link(root / 'release 1', root / 'current')
            atomic_link(root / 'release 2', root / 'current')
            self.assertEqual((root / 'current').readlink(), root / 'release 2')

    def test_modified_export_is_never_reported_as_clean_committed_source(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'export'
            manifest = bundle.build(output)
            manifest['sourceDirty'] = False  # model an export made from a committed revision
            (output / 'bundle-manifest.json').write_text(json.dumps(manifest))
            self.assertFalse(bundle.metadata(output)['sourceDirty'])
            (output / 'docs/demo-tools-macos.md').write_text('changed locally')
            changed = bundle.metadata(output)
            self.assertTrue(changed['sourceDirty'])
            self.assertEqual(changed['sourceRevision'], manifest['sourceRevision'])

    def test_second_installer_is_refused_and_lock_is_released_after_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            command = [sys.executable, '-c', 'from pathlib import Path; from install import installation_lock; import sys;\nwith installation_lock(Path(sys.argv[1])): print("acquired")', str(root)]
            environment = dict(os.environ, PYTHONPATH=str(Path(__file__).parent))
            with self.assertRaisesRegex(RuntimeError, 'simulated failure'):
                with installation_lock(root):
                    result = subprocess.run(command, env=environment, text=True, capture_output=True)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn('Another installer is running', result.stderr)
                    raise RuntimeError('simulated failure')
            result = subprocess.run(command, env=environment, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)

if __name__ == '__main__':
    unittest.main()

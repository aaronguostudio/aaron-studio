import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { loadDenylist, scan } from "./work-leak-check";

// Synthetic terms only: this file is itself scanned, so it must never hold a real identifier.
function tree() {
  const root = mkdtempSync(join(tmpdir(), "leak-check-"));
  mkdirSync(join(root, "tool", "node_modules"), { recursive: true });
  writeFileSync(join(root, "tool", "clean.md"), "A generic tool for any project.\n");
  writeFileSync(join(root, "tool", "leak.ts"), "const host = 'portal.acmewidgets.example';\n// for Zorblax\n");
  writeFileSync(join(root, "tool", "node_modules", "dep.js"), "Zorblax\n");
  writeFileSync(join(root, "tool", "image.png"), Buffer.from([0x89, 0x50, 0x00, 0x5a, 0x6f]));
  writeFileSync(join(root, "denylist"), "# client terms\nacmewidgets.example\nzorblax\n\n");
  return root;
}

describe("work leak check", () => {
  test("finds each denylisted term with file and line, case-insensitively", () => {
    const root = tree();
    const hits = scan(["tool"], loadDenylist(join(root, "denylist")), root);
    expect(hits).toEqual([
      { file: "tool/leak.ts", line: 1, term: "acmewidgets.example" },
      { file: "tool/leak.ts", line: 2, term: "Zorblax" },
    ]);
  });

  test("matches whole words only", () => {
    const root = tree();
    writeFileSync(join(root, "tool", "clean.md"), "zorblaxian and prezorblax are different words\n");
    expect(scan(["tool/clean.md"], ["zorblax"], root)).toEqual([]);
  });

  test("a missing or empty denylist fails instead of passing", () => {
    const root = tree();
    expect(() => loadDenylist(join(root, "nope"))).toThrow(/missing/);
    writeFileSync(join(root, "empty"), "# nothing yet\n\n");
    expect(() => loadDenylist(join(root, "empty"))).toThrow(/no terms/);
  });
});

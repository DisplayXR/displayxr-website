#!/usr/bin/env node
// Pulls mechanically-derivable facts from the DisplayXR org and writes them to
// lib/data/generated/*.json (+ icons into public/). The website's authored TSX
// imports these and merges editorial fields by id. See docs/org-sync.md.
//
// Run:  node scripts/sync-org.mjs        (uses GITHUB_TOKEN, else `gh auth token`)
// CI:   .github/workflows/sync-org.yml runs this and PRs the diff.
//
// Design rules:
//  - Deterministic output (no timestamps) so "nothing changed" => empty git diff.
//  - Each adapter is best-effort: a failing source warns and is skipped, never
//    aborts the run or blanks an existing file's worth of content.

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GEN = join(ROOT, "lib/data/generated");
const PUB = join(ROOT, "public");
const ORG = "DisplayXR";

// ── auth ────────────────────────────────────────────────────────────────────
const TOKEN =
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  (() => {
    try {
      return execSync("gh auth token", { encoding: "utf8" }).trim();
    } catch {
      return "";
    }
  })();
if (!TOKEN) {
  console.error("No token: set GITHUB_TOKEN or run `gh auth login`.");
  process.exit(1);
}

// ── http helpers ──────────────────────────────────────────────────────────────
const warnings = [];
const warn = (m) => {
  warnings.push(m);
  console.warn("  ! " + m);
};

async function api(path) {
  const res = await fetch("https://api.github.com" + path, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "displayxr-website-sync",
    },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function apiAllPages(path) {
  const out = [];
  for (let page = 1; page < 20; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const batch = await api(`${path}${sep}per_page=100&page=${page}`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

async function raw(repo, path, ref = "main") {
  const res = await fetch(
    `https://raw.githubusercontent.com/${ORG}/${repo}/${ref}/${path}`,
  );
  if (!res.ok) throw new Error(`raw ${repo}/${path} -> ${res.status}`);
  return res.text();
}

async function rawJson(repo, path, ref = "main") {
  return JSON.parse(await raw(repo, path, ref));
}

async function tree(repo, ref = "main") {
  const t = await api(`/repos/${ORG}/${repo}/git/trees/${ref}?recursive=1`);
  return (t.tree || []).map((n) => n.path);
}

async function latestRelease(repo) {
  try {
    const r = await api(`/repos/${ORG}/${repo}/releases/latest`);
    return {
      tag: r.tag_name,
      releaseUrl: r.html_url,
      releaseDate: (r.published_at || "").slice(0, 10),
      assets: (r.assets || []).map((a) => a.name),
    };
  } catch {
    return null; // no release yet (e.g. displayxr-unreal-test)
  }
}

// Download a binary asset into public/ and return the web path it lives at.
async function fetchAsset(repo, repoPath, destDir) {
  const url = `https://raw.githubusercontent.com/${ORG}/${repo}/main/${repoPath}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`asset ${repo}/${repoPath} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = basename(repoPath);
  const absDir = join(PUB, destDir);
  mkdirSync(absDir, { recursive: true });
  writeFileSync(join(absDir, file), buf);
  return `/${destDir}/${file}`; // public path
}

const sortByName = (a, b) => a.name.localeCompare(b.name);
const writeGen = (name, data) => {
  mkdirSync(GEN, { recursive: true });
  writeFileSync(join(GEN, name), JSON.stringify(data, null, 2) + "\n");
  console.log(`  → lib/data/generated/${name}`);
};

// ── config ────────────────────────────────────────────────────────────────────
// Non-demo bundle components. Version comes from versions.json where present,
// else the repo's latest release. platforms is editorial-stable, kept here.
const COMPONENTS = [
  { id: "runtime", vkey: "runtime", repo: "displayxr-runtime", name: "DisplayXR Runtime", platforms: "Windows · macOS" },
  { id: "shell", vkey: "shell", repo: "displayxr-shell-releases", name: "DisplayXR Shell", platforms: "Windows" },
  { id: "leia_plugin", vkey: "leia_plugin", repo: "displayxr-leia-plugin", name: "Leia SR Plug-in", platforms: "Windows" },
  { id: "mcp_tools", vkey: "mcp_tools", repo: "displayxr-mcp", name: "DisplayXR MCP Tools", platforms: "Windows · macOS" },
  { id: "installer", vkey: null, repo: "displayxr-installer", name: "All-in-one Installer", platforms: "Windows · macOS" },
];

// Engine plugins (intentionally NOT in versions.json). Version from in-tree
// manifest; logo from the *-test sibling (PNG) or the plugin Resources/ fallback.
const ENGINES = [
  {
    id: "unity",
    name: "Unity",
    repo: "displayxr-unity",
    testRepo: "displayxr-unity-test",
    versionFrom: { kind: "package-json", path: "package.json" },
    logo2d: { repo: "displayxr-unity-test", path: "Assets/XR/DisplayXR-test_logo_2d_512x512.png" },
  },
  {
    id: "unreal",
    name: "Unreal",
    repo: "displayxr-unreal",
    testRepo: "displayxr-unreal-test",
    versionFrom: { kind: "uplugin", path: "DisplayXR.uplugin" },
    // The shell logos ship as .uasset (not web-usable); unreal-test also commits
    // a PNG export of the 2D logo alongside them, mirroring displayxr-unity-test.
    logo2d: { repo: "displayxr-unreal-test", path: "Content/Icons/DisplayXRTest_logo_2d_512x512.png" },
  },
];

const ADR_SOURCES = [
  { repo: "displayxr-runtime", prefix: "docs/adr/" },
  { repo: "displayxr-unreal", prefix: "Docs/DisplayXR/adr/" },
];

// ── adapters ──────────────────────────────────────────────────────────────────
async function buildComponents(versions) {
  const out = [];
  for (const c of COMPONENTS) {
    const rel = await latestRelease(c.repo);
    const version = (c.vkey && versions[c.vkey]) || rel?.tag || null;
    if (!version) warn(`no version for component ${c.id}`);
    out.push({
      id: c.id,
      name: c.name,
      version,
      releaseUrl: rel?.releaseUrl || `https://github.com/${ORG}/${c.repo}/releases/latest`,
      releaseDate: rel?.releaseDate || null,
      platforms: c.platforms,
      repoUrl: `https://github.com/${ORG}/${c.repo}`,
    });
  }
  return out;
}

async function buildDemos(demoRepos) {
  const out = [];
  for (const repo of demoRepos) {
    try {
      const paths = await tree(repo);
      const manifests = paths.filter((p) => /displayxr\/[^/]+\.displayxr\.json$/.test(p));
      if (manifests.length === 0) {
        warn(`${repo}: no *.displayxr.json manifest — skipped`);
        continue;
      }
      // Prefer the windows manifest for a stable pick across platforms.
      const mPath = manifests.find((p) => p.startsWith("windows/")) || manifests.sort()[0];
      const m = await rawJson(repo, mPath);
      const dir = dirname(mPath);
      const destDir = join("demos", repo);

      // 2D icon only — this is a flat (non-stereo) website, so the manifest's
      // icon_3d (sbs-lr) asset is intentionally not pulled.
      let icon = null;
      if (m.icon) {
        try {
          icon = await fetchAsset(repo, `${dir}/${m.icon}`, destDir);
        } catch (e) {
          warn(`${repo}: icon ${m.icon} — ${e.message}`);
        }
      }
      const rel = await latestRelease(repo);
      out.push({
        id: repo.replace(/^displayxr-demo-/, ""),
        repo,
        name: m.name || repo,
        description: m.description || "",
        category: m.category || "demo",
        type: m.type || null,
        icon,
        repoUrl: `https://github.com/${ORG}/${repo}`,
        releaseUrl: rel?.releaseUrl || null,
        tag: rel?.tag || null,
      });
    } catch (e) {
      warn(`${repo}: demo adapter failed — ${e.message}`);
    }
  }
  return out.sort(sortByName);
}

async function buildEngines() {
  const out = [];
  for (const e of ENGINES) {
    try {
      let version = null,
        engineVersion = null;
      if (e.versionFrom.kind === "package-json") {
        const pkg = await rawJson(e.repo, e.versionFrom.path);
        version = pkg.version ? `v${pkg.version}` : null;
        engineVersion = pkg.unity ? `Unity ${pkg.unity}` : null;
      } else if (e.versionFrom.kind === "uplugin") {
        const up = await rawJson(e.repo, e.versionFrom.path);
        version = up.VersionName ? `v${up.VersionName}` : null;
        engineVersion = up.EngineVersion ? `UE ${up.EngineVersion}` : null;
      }
      const repoMeta = await api(`/repos/${ORG}/${e.repo}`);
      const rel = await latestRelease(e.repo);

      let logo = null;
      const destDir = join("engines", e.id);
      if (e.logo2d) {
        try {
          logo = await fetchAsset(e.logo2d.repo, e.logo2d.path, destDir);
        } catch (err) {
          warn(`${e.id}: logo2d — ${err.message}`);
        }
      }
      out.push({
        id: e.id,
        name: e.name,
        version: version || rel?.tag || null,
        engineVersion,
        description: repoMeta.description || "",
        repoUrl: `https://github.com/${ORG}/${e.repo}`,
        testRepoUrl: `https://github.com/${ORG}/${e.testRepo}`,
        releaseUrl: rel?.releaseUrl || null,
        logo,
      });
    } catch (err) {
      warn(`${e.id}: engine adapter failed — ${err.message}`);
    }
  }
  return out;
}

function extGroup(name) {
  if (/window_binding|gl_binding/.test(name)) return "windowing";
  if (/workspace|app_launcher|file_dialog/.test(name)) return "workspace";
  return "display";
}

async function buildExtensions() {
  const paths = await tree("displayxr-extensions");
  const names = paths
    .filter((p) => /\/XR_(?:EXT|DXR)_[^/]+\.h$/.test(p))
    .map((p) => basename(p).replace(/\.h$/, ""));
  return [...new Set(names)]
    .sort()
    .map((name) => ({ name, group: extGroup(name) }));
}

async function buildRepos(allRepos) {
  return allRepos
    .filter((r) => !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description || "",
      url: r.html_url,
      topics: r.topics || [],
      archived: r.archived,
    }))
    .sort(sortByName);
}

async function buildSignals(allRepos) {
  const adrs = [];
  for (const s of ADR_SOURCES) {
    try {
      const paths = await tree(s.repo);
      for (const p of paths) {
        if (p.startsWith(s.prefix) && /ADR-\d+.*\.md$/.test(p)) {
          adrs.push(`${s.repo}/${p}`);
        }
      }
    } catch (e) {
      warn(`adr scan ${s.repo} — ${e.message}`);
    }
  }
  return {
    adrs: adrs.sort(),
    demoRepos: allRepos
      .filter((r) => /^displayxr-demo-/.test(r.name) && !r.archived)
      .map((r) => r.name)
      .sort(),
    repos: allRepos.filter((r) => !r.archived).map((r) => r.name).sort(),
  };
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Syncing from DisplayXR org…");

  // Clean regenerated asset trees so removed icons don't linger.
  rmSync(join(PUB, "demos"), { recursive: true, force: true });
  rmSync(join(PUB, "engines"), { recursive: true, force: true });

  const versions = await rawJson("displayxr-runtime", "versions.json").catch((e) => {
    warn(`versions.json — ${e.message}`);
    return {};
  });
  const allRepos = await apiAllPages(`/orgs/${ORG}/repos?type=public`);
  const demoRepos = allRepos
    .filter((r) => /^displayxr-demo-/.test(r.name) && !r.archived)
    .map((r) => r.name)
    .sort();
  console.log(`  discovered ${demoRepos.length} demo repos: ${demoRepos.join(", ")}`);

  const [components, demos, engines, extensions, repos, signals] = await Promise.all([
    buildComponents(versions),
    buildDemos(demoRepos),
    buildEngines(),
    buildExtensions(),
    buildRepos(allRepos),
    buildSignals(allRepos),
  ]);

  writeGen("components.json", components);
  writeGen("demos.json", demos);
  writeGen("engines.json", engines);
  writeGen("extensions.json", extensions);
  writeGen("repos.json", repos);
  writeGen("_meta.json", { signals });

  console.log(
    `\nDone. ${components.length} components · ${demos.length} demos · ${engines.length} engines · ${extensions.length} extensions · ${repos.length} repos`,
  );
  if (warnings.length) console.log(`${warnings.length} warning(s) — see above.`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});

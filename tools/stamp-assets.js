"use strict";
// Refresh only root index.html's local JS/CSS URLs. --check never writes files.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const DEFAULT_ROOT = path.resolve(__dirname, "..");
// Git checks these text files out as CRLF on Windows and LF on Pages.
const hash = bytes => crypto.createHash("sha256").update(String(bytes).replace(/\r\n/g, "\n"), "utf8").digest("hex").slice(0, 16);
const decodeAttribute = value => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const encodeAttribute = value => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function versionHtml(html, root = DEFAULT_ROOT, readAsset = file => fs.readFileSync(file)) {
  const assets = [];
  const updated = html.replace(/<(?:script|link)\b[^>]*>/gi, tag => {
    const script = /^<script\b/i.test(tag);
    if (!script) {
      const rel = /\brel\s*=\s*(["'])(.*?)\1/i.exec(tag);
      if (!rel || !rel[2].toLowerCase().split(/\s+/).includes("stylesheet")) return tag;
    }
    const attribute = script ? /(\bsrc\s*=\s*)(["'])(.*?)\2/i : /(\bhref\s*=\s*)(["'])(.*?)\2/i;
    return tag.replace(attribute, (match, prefix, quote, encoded) => {
      const value = decodeAttribute(encoded);
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return match;
      const hashAt = value.indexOf("#");
      const fragment = hashAt < 0 ? "" : value.slice(hashAt);
      const beforeHash = hashAt < 0 ? value : value.slice(0, hashAt);
      const queryAt = beforeHash.indexOf("?");
      const pathname = queryAt < 0 ? beforeHash : beforeHash.slice(0, queryAt);
      if (!/\.(?:m?js|css)$/i.test(pathname)) return match;
      const decodedPath = decodeURIComponent(pathname);
      if (path.isAbsolute(decodedPath) || /^[\\/]/.test(decodedPath)) throw Error("Expected a project-relative asset: " + value);
      const file = path.resolve(root, decodedPath);
      const relative = path.relative(root, file);
      if (relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) throw Error("Asset leaves the site folder: " + value);
      const expected = hash(readAsset(file));
      const params = new URLSearchParams(queryAt < 0 ? "" : beforeHash.slice(queryAt + 1));
      const actual = params.getAll("v");
      params.set("v", expected);
      const versioned = pathname + "?" + params.toString() + fragment;
      assets.push({ file, relative, expected, actual: actual.length === 1 ? actual[0] : null, current: actual.length === 1 && actual[0] === expected });
      return prefix + quote + encodeAttribute(versioned) + quote;
    });
  });
  return { html: updated, assets };
}

function preflightOutput(file) {
  const absolute = path.resolve(file);
  if (absolute.length > 200) throw Error("Output path exceeds the 200-character workspace target: " + absolute);
  const parts = absolute.slice(path.parse(absolute).root.length).split(path.sep);
  for (const part of parts) {
    if (part.length > 255 || /[<>:"|?*\x00-\x1f]/.test(part) || /^ | $|\.$/.test(part) ||
        /^(?:con|prn|aux|nul|com[0-9¹²³]|lpt[0-9¹²³])(?:\.|$)/i.test(part) ||
        /_vti_/i.test(part) || /^(?:desktop\.ini|\.lock)$/i.test(part) || part.startsWith("~$")) {
      throw Error("Unsafe Windows/OneDrive path component: " + part);
    }
  }
  const basename = path.basename(absolute);
  if (basename.length > 64 || !/^[a-z0-9_-]+\.[a-z0-9]+$/.test(basename) || /\.tmp$/i.test(basename)) throw Error("Unsafe output filename: " + basename);
  const siblings = fs.readdirSync(path.dirname(absolute)).filter(name => name.toLowerCase() === basename.toLowerCase());
  if (siblings.length !== 1 || siblings[0] !== basename) throw Error("Missing output or case-insensitive collision: " + absolute);
  if (!fs.lstatSync(absolute).isFile()) throw Error("Output must be an existing regular file: " + absolute);
  return absolute;
}

function inspect(root = DEFAULT_ROOT) {
  const file = path.join(root, "index.html");
  const original = fs.readFileSync(file, "utf8");
  return { file, original, ...versionHtml(original, root) };
}

function run(args = process.argv.slice(2)) {
  if (args.some(argument => argument !== "--check") || args.length > 1) throw Error("Usage: node tools/stamp-assets.js [--check]");
  const result = inspect();
  if (!result.assets.length) throw Error("No local JavaScript or stylesheet references were found.");
  const stale = result.assets.filter(asset => !asset.current);
  if (args.includes("--check")) {
    if (stale.length) throw Error("Asset versions are missing or stale: " + stale.map(asset => asset.relative).join(", ") + ". Run node tools/stamp-assets.js.");
    console.log("PASS: " + result.assets.length + " local script/stylesheet URLs match their content hashes. No files written.");
    return;
  }
  if (result.html === result.original) {
    console.log("Already current: " + result.assets.length + " local script/stylesheet URLs. No files written.");
    return;
  }
  const target = preflightOutput(result.file);
  if (fs.readFileSync(target, "utf8") !== result.original) throw Error("index.html changed during inspection; retry after its writer finishes.");
  fs.writeFileSync(target, result.html, "utf8");
  console.log("Stamped " + result.assets.length + " local script/stylesheet URLs in index.html; " + stale.length + " hashes updated.");
}

module.exports = { versionHtml, inspect, hash };
if (require.main === module) {
  try { run(); }
  catch (error) { console.error("Asset version check failed: " + error.message); process.exitCode = 1; }
}

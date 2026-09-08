const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');

const root = resolve(__dirname, '../..');
const cache = new Map();

// Load real local TypeScript modules and their dependencies without a new test runtime.
function loadTypeScript(filename) {
  filename = resolve(root, filename);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const nativeRequire = createRequire(filename);
  const requireModule = (id) => {
    const local = id.startsWith('@/') ? resolve(root, id.slice(2))
      : id.startsWith('.') ? resolve(dirname(filename), id) : null;
    if (local && existsSync(`${local}.ts`)) return loadTypeScript(`${local}.ts`);
    return nativeRequire(id);
  };
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  new Function('require', 'exports', source)(requireModule, exports);
  return exports;
}

module.exports = { loadTypeScript };

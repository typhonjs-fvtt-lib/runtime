import fs      from 'node:fs';
import module  from 'node:module';

const requireMod = module.createRequire(import.meta.url);
const packageJSONPath = requireMod.resolve('@typhonjs-svelte/runtime-base/package.json');
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'));

const s_EXCLUDE = ['./package.json'];

const distPath = packageJSONPath.replace('package.json', '_dist');

// Formats exports from @typhonjs-svelte/runtime-base package.json removing package.json reference and leading `.`.
const exportsRuntimePackage = Object.keys(packageJSON.exports).filter((entry) => !s_EXCLUDE.includes(entry)).map(
 (entry) => entry.substring(2));

export { distPath, exportsRuntimePackage };

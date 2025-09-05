import fs      from 'node:fs';
import module  from 'node:module';

const requireMod = module.createRequire(import.meta.url);
const packageJSONPath = requireMod.resolve('@typhonjs-svelte/runtime-base/package.json');
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'));

/**
 * The following `runtime-base` entries are skipped. Local platform specific implementations for Foundry are added for
 * the following sub-path exports:
 * - `svelte/action/dom/tooltip`
 * - `util/dom/theme`
 * - `util/i18n`
 * - `util/path`
 *
 * @type {string[]}
 */
const s_EXCLUDE = [
   './package.json',
   './svelte/action/dom/tooltip',
   './util/dom/theme',
   './util/i18n',
   '.util/path'
];

const distPath = packageJSONPath.replace('package.json', '_dist');

// Formats exports from @typhonjs-svelte/runtime-base package.json removing package.json reference and leading `.`.
const exportsRuntimePackage = Object.keys(packageJSON.exports).filter((entry) => !s_EXCLUDE.includes(entry)).map(
 (entry) => entry.substring(2));

export { distPath, exportsRuntimePackage };

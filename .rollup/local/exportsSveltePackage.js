import fs      from 'fs';
import module  from 'module';

const requireMod = module.createRequire(import.meta.url);
const packageJSONPath = requireMod.resolve('@typhonjs-fvtt/svelte/package.json');
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString());

const distPath = packageJSONPath.replace('package.json', '_dist');

// `package.json` is skipped, but both Svelte application submodules need to be copied and paths converted separately.
const s_EXCLUDE = ['./package.json', './application', './application/dialog', './application/legacy', './gsap/plugin/*',
 './gsap/plugin/bonus/*']

// Formats exports from @typhonjs-fvtt/svelte package.json removing package.json reference and leading `.`.
const exportsSveltePackage = Object.keys(packageJSON.exports).filter((entry) => !s_EXCLUDE.includes(entry)).map(
 (entry) => entry.substring(2));

export { distPath, exportsSveltePackage };
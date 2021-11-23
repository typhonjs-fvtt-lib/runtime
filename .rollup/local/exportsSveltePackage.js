import fs      from 'fs';
import module  from 'module';

const requireMod = module.createRequire(import.meta.url);
const packageJSON = JSON.parse(fs.readFileSync(requireMod.resolve('@typhonjs-fvtt/svelte/package.json')).toString());

// `package.json` is skipped, but both Svelte application submodules need to be copied and paths converted separately.
const s_EXCLUDE = ['./package.json', './application', './application/legacy']

// Formats exports from @typhonjs-fvtt/svelte package.json removing package.json reference and leading `.`.
const exportsSveltePackage = Object.keys(packageJSON.exports).filter((entry) => !s_EXCLUDE.includes(entry)).map(
 (entry) => entry.substring(1));

export { exportsSveltePackage };
import fs      from 'fs';
import module  from 'module';

const requireMod = module.createRequire(import.meta.url);
const packageJSON = JSON.parse(fs.readFileSync(requireMod.resolve('@typhonjs-fvtt/svelte/package.json')).toString());

// Formats exports from @typhonjs-fvtt/svelte package.json removing package.json reference and leading `.`.
const exportsSveltePackage = Object.keys(packageJSON.exports).filter(
 (entry) => entry !== './package.json').map(
  (entry) => entry.substring(1));

export { exportsSveltePackage };
![@typhonjs-fvtt/runtime](https://i.imgur.com/dxLcZrL.jpg)

[![TyphonJS Discord](https://img.shields.io/discord/737953117999726592?label=TyphonJS%20Discord)](https://typhonjs.io/discord/)
[![Twitch](https://img.shields.io/twitch/status/typhonrt?style=social)](https://www.twitch.tv/typhonrt)

[![NPM](https://img.shields.io/npm/v/@typhonjs-fvtt/runtime.svg?label=npm)](https://www.npmjs.com/package/@typhonjs-fvtt/runtime)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-fvtt/fvttdev/blob/main/LICENSE)

## About:
The TyphonJS Runtime Library (TRL) brings an exciting new library resource for all [Foundry VTT](https://foundryvtt.com/)
developers to build advanced modules and game systems using [Svelte](https://svelte.dev/). A Svelte UI component library
built for Foundry and extensions to the core Foundry UI / Application framework make it easy to create declarative
Svelte based UIs in a method familiar to Foundry VTT developers. The core UI component framework contains reactive
"application shells" that provide an enhanced ability to control your UI / window experience including intro and outro
transitions along with supporting key UI elements like context menus and a new backward compatible and API compliant Dialog
component that features a modal dialog option.

TRL is innovative as it delivers a runtime library module for Foundry that packages up the runtime in a way that
can be shared across any number of modules / game systems utilizing it thereby saving a lot of space in any given
module or game system and across all Foundry packages that incorporate the runtime library module. Optionally, it is
possible to also bundle TRL directly into your module or game system. The TRL is both a Foundry library module
(forthcoming) and a NPM package providing the development dependency utilized while authoring a Foundry package.

## Installation:
In your `package.json` `imports` and `dependencies` include:
```json
{
  "imports": {
    "#runtime/*": "@typhonjs-fvtt/runtime/*"
  },
  "dependencies": {
    "@typhonjs-fvtt/runtime": "^0.2.0",
    "svelte": "^4.0.0"
  }
}
```

You may use the highest released Svelte version greater than `4.0.0`. It is recommended that you view the demo examples
for the rest of the standard configuration details which use Vite for building your package.

## API Documentation:
The initial beta release of TRL now has unified API documentation for all ESM packages
[available here](https://typhonjs-fvtt-lib.github.io/api-docs/). Work is still ongoing to provide type declarations and
documentation for all of the Svelte components available in TRL.

## ES Module Demo Module:
- [essential-svelte-esm](https://github.com/typhonjs-fvtt-demo/essential-svelte-esm) for a demo repo
w/ several basic TRL / Foundry examples utilizing the TRL.

- [template-svelte-esm](https://github.com/typhonjs-fvtt-demo/template-svelte-esm) for a starter bare bones template
repo to duplicate for your own module.

- [typhonjs-fvtt-demo organization](https://github.com/typhonjs-fvtt-demo/) for
all demo repos.

## Roadmap:
The following roadmap contains a high level overview of aspects that will be added to the TRL.

- Complete native Svelte drag and drop support with support for reactive embedded collections.
- Continue to add relevant core components useful in standard Foundry UI development.

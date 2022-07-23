/**
 * Stores the PositionData properties that can be animated.
 *
 * @type {Set<string>}
 */
const animateKeys = new Set([
   // Main keys
   'left', 'top', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'width', 'height',
   'rotateX', 'rotateY', 'rotateZ', 'scale', 'translateX', 'translateY', 'translateZ', 'zIndex',

   // Aliases
   'rotation'
]);

/**
 * Defines the keys of PositionData that are transform keys.
 *
 * @type {string[]}
 */
const transformKeys = ['rotateX', 'rotateY', 'rotateZ', 'scale', 'translateX', 'translateY', 'translateZ'];

Object.freeze(transformKeys);

/**
 * Parses a relative value string in the form of '+=', '-=', or '*=' and float / numeric value. IE '+=0.2'.
 *
 * @type {RegExp}
 */
const relativeRegex = /^([-+*])=(-?[\d]*\.?[\d]+)$/;

/**
 * Provides numeric defaults for all parameters. This is used by {@link Position.get} to optionally provide
 * numeric defaults.
 *
 * @type {{rotation: number, scale: number, minWidth: null, minHeight: null, translateZ: number, top: number, left: number, maxHeight: null, translateY: number, translateX: number, width: number, transformOrigin: null, rotateX: number, rotateY: number, height: number, maxWidth: null, zIndex: null, rotateZ: number}}
 */
const numericDefaults = {
   // Other keys
   height: 0,
   left: 0,
   maxHeight: null,
   maxWidth: null,
   minHeight: null,
   minWidth: null,
   top: 0,
   transformOrigin: null,
   width: 0,
   zIndex: null,

   rotateX: 0,
   rotateY: 0,
   rotateZ: 0,
   scale: 1,
   translateX: 0,
   translateY: 0,
   translateZ: 0,

   rotation: 0
};

Object.freeze(numericDefaults);

/**
 * Sets numeric defaults for a {@link PositionData} like object.
 *
 * @param {object}   data - A PositionData like object.
 */
function setNumericDefaults(data)
{
   // Transform keys
   if (data.rotateX === null) { data.rotateX = 0; }
   if (data.rotateY === null) { data.rotateY = 0; }
   if (data.rotateZ === null) { data.rotateZ = 0; }
   if (data.translateX === null) { data.translateX = 0; }
   if (data.translateY === null) { data.translateY = 0; }
   if (data.translateZ === null) { data.translateZ = 0; }
   if (data.scale === null) { data.scale = 1; }

   // Aliases
   if (data.rotation === null) { data.rotation = 0; }
}

/**
 * Defines bitwise keys for transforms used in {@link Transforms.getMat4}.
 *
 * @type {object}
 */
const transformKeysBitwise = {
   rotateX: 1,
   rotateY: 2,
   rotateZ: 4,
   scale: 8,
   translateX: 16,
   translateY: 32,
   translateZ: 64
};

Object.freeze(transformKeysBitwise);

/**
 * Defines the default transform origin.
 *
 * @type {string}
 */
const transformOriginDefault = 'top left';

/**
 * Defines the valid transform origins.
 *
 * @type {string[]}
 */
const transformOrigins = ['top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left',
 'bottom center', 'bottom right'];

Object.freeze(transformOrigins);

export {
   animateKeys,
   numericDefaults,
   relativeRegex,
   setNumericDefaults,
   transformKeys,
   transformKeysBitwise,
   transformOriginDefault,
   transformOrigins
};

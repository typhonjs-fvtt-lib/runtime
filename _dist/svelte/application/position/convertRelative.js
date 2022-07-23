import * as constants from './constants.js';

/**
 * Converts any relative string values for animatable keys to actual updates performed against current data.
 *
 * @param {PositionDataExtended}    positionData - position data.
 *
 * @param {Position|PositionData}   position - The source position instance.
 */
export function convertRelative(positionData, position)
{
   for (const key in positionData)
   {
      // Key is animatable / numeric.
      if (constants.animateKeys.has(key))
      {
         const value = positionData[key];

         if (typeof value !== 'string') { continue; }

         // Ignore 'auto' and 'inherit' string values.
         if (value === 'auto' || value === 'inherit') { continue; }

         const regexResults = constants.relativeRegex.exec(value);

         if (!regexResults)
         {
            throw new Error(
             `convertRelative error: malformed relative key (${key}) with value (${value})`);
         }

         const current = position[key];

         switch (regexResults[1])
         {
            case '-':
               positionData[key] = current - parseFloat(regexResults[2]);
               break;

            case '+':
               positionData[key] = current + parseFloat(regexResults[2]);
               break;

            case '*':
               positionData[key] = current * parseFloat(regexResults[2]);
               break;
         }
      }
   }
}

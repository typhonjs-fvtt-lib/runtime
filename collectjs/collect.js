var src = {exports: {}};

var symbol_iterator = function SymbolIterator() {
  let index = -1;

  return {
    next: () => {
      index += 1;

      return {
        value: this.items[index],
        done: index >= this.items.length,
      };
    },
  };
};

var all = function all() {
  return this.items;
};

var is = {
  /**
   * @returns {boolean}
   */
  isArray: item => Array.isArray(item),

  /**
   * @returns {boolean}
   */
  isObject: item => typeof item === 'object' && Array.isArray(item) === false && item !== null,

  /**
   * @returns {boolean}
   */
  isFunction: item => typeof item === 'function',
};

const { isFunction: isFunction$f } = is;

var average$1 = function average(key) {
  if (key === undefined) {
    return this.sum() / this.items.length;
  }

  if (isFunction$f(key)) {
    return new this.constructor(this.items).sum(key) / this.items.length;
  }

  return new this.constructor(this.items).pluck(key).sum() / this.items.length;
};

const average = average$1;

var avg = average;

var chunk = function chunk(size) {
  const chunks = [];
  let index = 0;

  if (Array.isArray(this.items)) {
    do {
      const items = this.items.slice(index, index + size);
      const collection = new this.constructor(items);

      chunks.push(collection);
      index += size;
    } while (index < this.items.length);
  } else if (typeof this.items === 'object') {
    const keys = Object.keys(this.items);

    do {
      const keysOfChunk = keys.slice(index, index + size);
      const collection = new this.constructor({});

      keysOfChunk.forEach(key => collection.put(key, this.items[key]));

      chunks.push(collection);
      index += size;
    } while (index < keys.length);
  } else {
    chunks.push(new this.constructor([this.items]));
  }

  return new this.constructor(chunks);
};

var collapse = function collapse() {
  return new this.constructor([].concat(...this.items));
};

var combine = function combine(array) {
  let values = array;

  if (values instanceof this.constructor) {
    values = array.all();
  }

  const collection = {};

  if (Array.isArray(this.items) && Array.isArray(values)) {
    this.items.forEach((key, iterator) => {
      collection[key] = values[iterator];
    });
  } else if (typeof this.items === 'object' && typeof values === 'object') {
    Object.keys(this.items).forEach((key, index) => {
      collection[this.items[key]] = values[Object.keys(values)[index]];
    });
  } else if (Array.isArray(this.items)) {
    collection[this.items[0]] = values;
  } else if (typeof this.items === 'string' && Array.isArray(values)) {
    [collection[this.items]] = values;
  } else if (typeof this.items === 'string') {
    collection[this.items] = values;
  }

  return new this.constructor(collection);
};

/**
 * Clone helper
 *
 * Clone an array or object
 *
 * @param items
 * @returns {*}
 */
var clone$2 = function clone(items) {
  let cloned;

  if (Array.isArray(items)) {
    cloned = [];

    cloned.push(...items);
  } else {
    cloned = {};

    Object.keys(items).forEach((prop) => {
      cloned[prop] = items[prop];
    });
  }

  return cloned;
};

const clone$1 = clone$2;

var concat = function concat(collectionOrArrayOrObject) {
  let list = collectionOrArrayOrObject;

  if (collectionOrArrayOrObject instanceof this.constructor) {
    list = collectionOrArrayOrObject.all();
  } else if (typeof collectionOrArrayOrObject === 'object') {
    list = [];
    Object.keys(collectionOrArrayOrObject).forEach((property) => {
      list.push(collectionOrArrayOrObject[property]);
    });
  }

  const collection = clone$1(this.items);

  list.forEach((item) => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(key => collection.push(item[key]));
    } else {
      collection.push(item);
    }
  });

  return new this.constructor(collection);
};

/**
 * Values helper
 *
 * Retrieve values from [this.items] when it is an array, object or Collection
 *
 * @returns {*}
 * @param items
 */
var values$8 = function values(items) {
  const valuesArray = [];

  if (Array.isArray(items)) {
    valuesArray.push(...items);
  } else if (items.constructor.name === 'Collection') {
    valuesArray.push(...items.all());
  } else {
    Object.keys(items).forEach(prop => valuesArray.push(items[prop]));
  }

  return valuesArray;
};

const values$7 = values$8;
const { isFunction: isFunction$e } = is;

var contains$1 = function contains(key, value) {
  if (value !== undefined) {
    if (Array.isArray(this.items)) {
      return this.items
        .filter(items => items[key] !== undefined && items[key] === value)
        .length > 0;
    }

    return this.items[key] !== undefined && this.items[key] === value;
  }

  if (isFunction$e(key)) {
    return (this.items.filter((item, index) => key(item, index)).length > 0);
  }

  if (Array.isArray(this.items)) {
    return this.items.indexOf(key) !== -1;
  }

  const keysAndValues = values$7(this.items);
  keysAndValues.push(...Object.keys(this.items));

  return keysAndValues.indexOf(key) !== -1;
};

var count = function count() {
  let arrayLength = 0;

  if (Array.isArray(this.items)) {
    arrayLength = this.items.length;
  }

  return Math.max(Object.keys(this.items).length, arrayLength);
};

var countBy = function countBy(fn = value => value) {
  return new this.constructor(this.items)
    .groupBy(fn)
    .map(value => value.count());
};

var crossJoin = function crossJoin(...values) {
  function join(collection, constructor, args) {
    let current = args[0];

    if (current instanceof constructor) {
      current = current.all();
    }

    const rest = args.slice(1);
    const last = !rest.length;
    let result = [];

    for (let i = 0; i < current.length; i += 1) {
      const collectionCopy = collection.slice();
      collectionCopy.push(current[i]);

      if (last) {
        result.push(collectionCopy);
      } else {
        result = result.concat(join(collectionCopy, constructor, rest));
      }
    }

    return result;
  }

  return new this.constructor(join([], this.constructor, [].concat([this.items], values)));
};

var dd = function dd() {
  this.dump();

  if (typeof process !== 'undefined') {
    process.exit(1);
  }
};

var diff = function diff(values) {
  let valuesToDiff;

  if (values instanceof this.constructor) {
    valuesToDiff = values.all();
  } else {
    valuesToDiff = values;
  }

  const collection = this.items.filter(item => valuesToDiff.indexOf(item) === -1);

  return new this.constructor(collection);
};

var diffAssoc = function diffAssoc(values) {
  let diffValues = values;

  if (values instanceof this.constructor) {
    diffValues = values.all();
  }

  const collection = {};

  Object.keys(this.items).forEach((key) => {
    if (diffValues[key] === undefined || diffValues[key] !== this.items[key]) {
      collection[key] = this.items[key];
    }
  });

  return new this.constructor(collection);
};

var diffKeys = function diffKeys(object) {
  let objectToDiff;

  if (object instanceof this.constructor) {
    objectToDiff = object.all();
  } else {
    objectToDiff = object;
  }

  const objectKeys = Object.keys(objectToDiff);

  const remainingKeys = Object.keys(this.items)
    .filter(item => objectKeys.indexOf(item) === -1);

  return new this.constructor(this.items).only(
    remainingKeys,
  );
};

var dump = function dump() {
  // eslint-disable-next-line
  console.log(this);

  return this;
};

var duplicates = function duplicates() {
  const occuredValues = [];
  const duplicateValues = {};

  const stringifiedValue = (value) => {
    if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value;
  };

  if (Array.isArray(this.items)) {
    this.items.forEach((value, index) => {
      const valueAsString = stringifiedValue(value);

      if (occuredValues.indexOf(valueAsString) === -1) {
        occuredValues.push(valueAsString);
      } else {
        duplicateValues[index] = value;
      }
    });
  } else if (typeof this.items === 'object') {
    Object.keys(this.items).forEach((key) => {
      const valueAsString = stringifiedValue(this.items[key]);

      if (occuredValues.indexOf(valueAsString) === -1) {
        occuredValues.push(valueAsString);
      } else {
        duplicateValues[key] = this.items[key];
      }
    });
  }

  return new this.constructor(duplicateValues);
};

var each = function each(fn) {
  let stop = false;

  if (Array.isArray(this.items)) {
    const { length } = this.items;

    for (let index = 0; index < length && !stop; index += 1) {
      stop = fn(this.items[index], index, this.items) === false;
    }
  } else {
    const keys = Object.keys(this.items);
    const { length } = keys;

    for (let index = 0; index < length && !stop; index += 1) {
      const key = keys[index];

      stop = fn(this.items[key], key, this.items) === false;
    }
  }

  return this;
};

var eachSpread = function eachSpread(fn) {
  this.each((values, key) => {
    fn(...values, key);
  });

  return this;
};

const values$6 = values$8;

var every = function every(fn) {
  const items = values$6(this.items);

  return items.every(fn);
};

/**
 * Variadic helper function
 *
 * @param args
 * @returns {Array}
 */
var variadic$4 = function variadic(args) {
  if (Array.isArray(args[0])) {
    return args[0];
  }

  return args;
};

const variadic$3 = variadic$4;

var except = function except(...args) {
  const properties = variadic$3(args);

  if (Array.isArray(this.items)) {
    const collection = this.items
      .filter(item => properties.indexOf(item) === -1);

    return new this.constructor(collection);
  }

  const collection = {};

  Object.keys(this.items).forEach((property) => {
    if (properties.indexOf(property) === -1) {
      collection[property] = this.items[property];
    }
  });

  return new this.constructor(collection);
};

function falsyValue(item) {
  if (Array.isArray(item)) {
    if (item.length) {
      return false;
    }
  } else if (item !== undefined && item !== null
    && typeof item === 'object') {
    if (Object.keys(item).length) {
      return false;
    }
  } else if (item) {
    return false;
  }

  return true;
}

function filterObject(func, items) {
  const result = {};
  Object.keys(items).forEach((key) => {
    if (func) {
      if (func(items[key], key)) {
        result[key] = items[key];
      }
    } else if (!falsyValue(items[key])) {
      result[key] = items[key];
    }
  });

  return result;
}

function filterArray(func, items) {
  if (func) {
    return items.filter(func);
  }
  const result = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!falsyValue(item)) {
      result.push(item);
    }
  }

  return result;
}

var filter = function filter(fn) {
  const func = fn || false;
  let filteredItems = null;
  if (Array.isArray(this.items)) {
    filteredItems = filterArray(func, this.items);
  } else {
    filteredItems = filterObject(func, this.items);
  }

  return new this.constructor(filteredItems);
};

const { isFunction: isFunction$d } = is;

var first = function first(fn, defaultValue) {
  if (isFunction$d(fn)) {
    for (let i = 0, { length } = this.items; i < length; i += 1) {
      const item = this.items[i];
      if (fn(item)) {
        return item;
      }
    }

    if (isFunction$d(defaultValue)) {
      return defaultValue();
    }

    return defaultValue;
  }

  if ((Array.isArray(this.items) && this.items.length) || (Object.keys(this.items).length)) {
    if (Array.isArray(this.items)) {
      return this.items[0];
    }

    const firstKey = Object.keys(this.items)[0];

    return this.items[firstKey];
  }

  if (isFunction$d(defaultValue)) {
    return defaultValue();
  }

  return defaultValue;
};

var firstWhere = function firstWhere(key, operator, value) {
  return this.where(key, operator, value).first() || null;
};

var flatMap = function flatMap(fn) {
  return this.map(fn).collapse();
};

const { isArray: isArray$8, isObject: isObject$9 } = is;

var flatten = function flatten(depth) {
  let flattenDepth = depth || Infinity;

  let fullyFlattened = false;
  let collection = [];

  const flat = function flat(items) {
    collection = [];

    if (isArray$8(items)) {
      items.forEach((item) => {
        if (isArray$8(item)) {
          collection = collection.concat(item);
        } else if (isObject$9(item)) {
          Object.keys(item).forEach((property) => {
            collection = collection.concat(item[property]);
          });
        } else {
          collection.push(item);
        }
      });
    } else {
      Object.keys(items).forEach((property) => {
        if (isArray$8(items[property])) {
          collection = collection.concat(items[property]);
        } else if (isObject$9(items[property])) {
          Object.keys(items[property]).forEach((prop) => {
            collection = collection.concat(items[property][prop]);
          });
        } else {
          collection.push(items[property]);
        }
      });
    }

    fullyFlattened = collection.filter(item => isObject$9(item));
    fullyFlattened = fullyFlattened.length === 0;

    flattenDepth -= 1;
  };

  flat(this.items);

  while (!fullyFlattened && flattenDepth > 0) {
    flat(collection);
  }

  return new this.constructor(collection);
};

var flip = function flip() {
  const collection = {};

  if (Array.isArray(this.items)) {
    Object.keys(this.items).forEach((key) => {
      collection[this.items[key]] = Number(key);
    });
  } else {
    Object.keys(this.items).forEach((key) => {
      collection[this.items[key]] = key;
    });
  }

  return new this.constructor(collection);
};

var forPage = function forPage(page, chunk) {
  let collection = {};

  if (Array.isArray(this.items)) {
    collection = this.items.slice((page * chunk) - chunk, page * chunk);
  } else {
    Object
      .keys(this.items)
      .slice((page * chunk) - chunk, page * chunk)
      .forEach((key) => {
        collection[key] = this.items[key];
      });
  }

  return new this.constructor(collection);
};

var forget = function forget(key) {
  if (Array.isArray(this.items)) {
    this.items.splice(key, 1);
  } else {
    delete this.items[key];
  }

  return this;
};

const { isFunction: isFunction$c } = is;

var get = function get(key, defaultValue = null) {
  if (this.items[key] !== undefined) {
    return this.items[key];
  }

  if (isFunction$c(defaultValue)) {
    return defaultValue();
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  return null;
};

/**
 * Get value of a nested property
 *
 * @param mainObject
 * @param key
 * @returns {*}
 */
var nestedValue$8 = function nestedValue(mainObject, key) {
  try {
    return key.split('.').reduce((obj, property) => obj[property], mainObject);
  } catch (err) {
    // If we end up here, we're not working with an object, and @var mainObject is the value itself
    return mainObject;
  }
};

const nestedValue$7 = nestedValue$8;
const { isFunction: isFunction$b } = is;

var groupBy = function groupBy(key) {
  const collection = {};

  this.items.forEach((item, index) => {
    let resolvedKey;

    if (isFunction$b(key)) {
      resolvedKey = key(item, index);
    } else if (nestedValue$7(item, key) || nestedValue$7(item, key) === 0) {
      resolvedKey = nestedValue$7(item, key);
    } else {
      resolvedKey = '';
    }

    if (collection[resolvedKey] === undefined) {
      collection[resolvedKey] = new this.constructor([]);
    }

    collection[resolvedKey].push(item);
  });

  return new this.constructor(collection);
};

const variadic$2 = variadic$4;

var has = function has(...args) {
  const properties = variadic$2(args);

  return properties.filter(key => Object.hasOwnProperty.call(this.items, key)).length
    === properties.length;
};

var implode = function implode(key, glue) {
  if (glue === undefined) {
    return this.items.join(key);
  }

  return new this.constructor(this.items).pluck(key).all().join(glue);
};

var intersect = function intersect(values) {
  let intersectValues = values;

  if (values instanceof this.constructor) {
    intersectValues = values.all();
  }

  const collection = this.items
    .filter(item => intersectValues.indexOf(item) !== -1);

  return new this.constructor(collection);
};

var intersectByKeys = function intersectByKeys(values) {
  let intersectKeys = Object.keys(values);

  if (values instanceof this.constructor) {
    intersectKeys = Object.keys(values.all());
  }

  const collection = {};

  Object.keys(this.items).forEach((key) => {
    if (intersectKeys.indexOf(key) !== -1) {
      collection[key] = this.items[key];
    }
  });

  return new this.constructor(collection);
};

var isEmpty = function isEmpty() {
  if (Array.isArray(this.items)) {
    return !this.items.length;
  }

  return !Object.keys(this.items).length;
};

var isNotEmpty = function isNotEmpty() {
  return !this.isEmpty();
};

var join = function join(glue, finalGlue) {
  const collection = this.values();

  if (finalGlue === undefined) {
    return collection.implode(glue);
  }

  const count = collection.count();

  if (count === 0) {
    return '';
  }

  if (count === 1) {
    return collection.last();
  }

  const finalItem = collection.pop();

  return collection.implode(glue) + finalGlue + finalItem;
};

const nestedValue$6 = nestedValue$8;
const { isFunction: isFunction$a } = is;

var keyBy = function keyBy(key) {
  const collection = {};

  if (isFunction$a(key)) {
    this.items.forEach((item) => {
      collection[key(item)] = item;
    });
  } else {
    this.items.forEach((item) => {
      const keyValue = nestedValue$6(item, key);

      collection[keyValue || ''] = item;
    });
  }

  return new this.constructor(collection);
};

var keys = function keys() {
  let collection = Object.keys(this.items);

  if (Array.isArray(this.items)) {
    collection = collection.map(Number);
  }

  return new this.constructor(collection);
};

const { isFunction: isFunction$9 } = is;

var last = function last(fn, defaultValue) {
  let { items } = this;

  if (isFunction$9(fn)) {
    items = this.filter(fn).all();
  }

  if ((Array.isArray(items) && !items.length) || (!Object.keys(items).length)) {
    if (isFunction$9(defaultValue)) {
      return defaultValue();
    }

    return defaultValue;
  }

  if (Array.isArray(items)) {
    return items[items.length - 1];
  }
  const keys = Object.keys(items);

  return items[keys[keys.length - 1]];
};

var macro = function macro(name, fn) {
  this.constructor.prototype[name] = fn;
};

var make = function make(items = []) {
  return new this.constructor(items);
};

var map = function map(fn) {
  if (Array.isArray(this.items)) {
    return new this.constructor(this.items.map(fn));
  }

  const collection = {};

  Object.keys(this.items).forEach((key) => {
    collection[key] = fn(this.items[key], key);
  });

  return new this.constructor(collection);
};

var mapSpread = function mapSpread(fn) {
  return this.map((values, key) => fn(...values, key));
};

var mapToDictionary = function mapToDictionary(fn) {
  const collection = {};

  this.items.forEach((item, k) => {
    const [key, value] = fn(item, k);

    if (collection[key] === undefined) {
      collection[key] = [value];
    } else {
      collection[key].push(value);
    }
  });

  return new this.constructor(collection);
};

var mapInto = function mapInto(ClassName) {
  return this.map((value, key) => new ClassName(value, key));
};

var mapToGroups = function mapToGroups(fn) {
  const collection = {};

  this.items.forEach((item, key) => {
    const [keyed, value] = fn(item, key);

    if (collection[keyed] === undefined) {
      collection[keyed] = [value];
    } else {
      collection[keyed].push(value);
    }
  });

  return new this.constructor(collection);
};

var mapWithKeys = function mapWithKeys(fn) {
  const collection = {};

  if (Array.isArray(this.items)) {
    this.items.forEach((item) => {
      const [keyed, value] = fn(item);
      collection[keyed] = value;
    });
  } else {
    Object.keys(this.items).forEach((key) => {
      const [keyed, value] = fn(this.items[key]);
      collection[keyed] = value;
    });
  }

  return new this.constructor(collection);
};

var max = function max(key) {
  if (typeof key === 'string') {
    const filtered = this.items.filter(item => item[key] !== undefined);

    return Math.max(...filtered.map(item => item[key]));
  }

  return Math.max(...this.items);
};

var median = function median(key) {
  const { length } = this.items;

  if (key === undefined) {
    if (length % 2 === 0) {
      return (this.items[(length / 2) - 1] + this.items[length / 2]) / 2;
    }

    return this.items[Math.floor(length / 2)];
  }

  if (length % 2 === 0) {
    return (this.items[(length / 2) - 1][key]
      + this.items[length / 2][key]) / 2;
  }

  return this.items[Math.floor(length / 2)][key];
};

var merge = function merge(value) {
  let arrayOrObject = value;

  if (typeof arrayOrObject === 'string') {
    arrayOrObject = [arrayOrObject];
  }

  if (Array.isArray(this.items) && Array.isArray(arrayOrObject)) {
    return new this.constructor(this.items.concat(arrayOrObject));
  }

  const collection = JSON.parse(JSON.stringify(this.items));

  Object.keys(arrayOrObject).forEach((key) => {
    collection[key] = arrayOrObject[key];
  });

  return new this.constructor(collection);
};

var mergeRecursive = function mergeRecursive(items) {
  const merge = (target, source) => {
    const merged = {};

    const mergedKeys = Object.keys(Object.assign({}, target, source));

    mergedKeys.forEach((key) => {
      if (target[key] === undefined && source[key] !== undefined) {
        merged[key] = source[key];
      } else if (target[key] !== undefined && source[key] === undefined) {
        merged[key] = target[key];
      } else if (target[key] !== undefined && source[key] !== undefined) {
        if (target[key] === source[key]) {
          merged[key] = target[key];
        } else if (
          (!Array.isArray(target[key]) && typeof target[key] === 'object')
          && (!Array.isArray(source[key]) && typeof source[key] === 'object')
        ) {
          merged[key] = merge(target[key], source[key]);
        } else {
          merged[key] = [].concat(target[key], source[key]);
        }
      }
    });

    return merged;
  };

  if (!items) {
    return this;
  }

  if (items.constructor.name === 'Collection') {
    return new this.constructor(merge(this.items, items.all()));
  }

  return new this.constructor(merge(this.items, items));
};

var min = function min(key) {
  if (key !== undefined) {
    const filtered = this.items.filter(item => item[key] !== undefined);

    return Math.min(...filtered.map(item => item[key]));
  }

  return Math.min(...this.items);
};

var mode = function mode(key) {
  const values = [];
  let highestCount = 1;

  if (!this.items.length) {
    return null;
  }

  this.items.forEach((item) => {
    const tempValues = values.filter((value) => {
      if (key !== undefined) {
        return value.key === item[key];
      }

      return value.key === item;
    });

    if (!tempValues.length) {
      if (key !== undefined) {
        values.push({ key: item[key], count: 1 });
      } else {
        values.push({ key: item, count: 1 });
      }
    } else {
      tempValues[0].count += 1;
      const { count } = tempValues[0];

      if (count > highestCount) {
        highestCount = count;
      }
    }
  });

  return values
    .filter(value => value.count === highestCount)
    .map(value => value.key);
};

const values$5 = values$8;

var nth = function nth(n, offset = 0) {
  const items = values$5(this.items);

  const collection = items
    .slice(offset)
    .filter((item, index) => index % n === 0);

  return new this.constructor(collection);
};

const variadic$1 = variadic$4;

var only = function only(...args) {
  const properties = variadic$1(args);

  if (Array.isArray(this.items)) {
    const collection = this.items
      .filter(item => properties.indexOf(item) !== -1);

    return new this.constructor(collection);
  }

  const collection = {};

  Object.keys(this.items).forEach((prop) => {
    if (properties.indexOf(prop) !== -1) {
      collection[prop] = this.items[prop];
    }
  });

  return new this.constructor(collection);
};

const clone = clone$2;

var pad = function pad(size, value) {
  const abs = Math.abs(size);
  const count = this.count();

  if (abs <= count) {
    return this;
  }

  let diff = abs - count;
  const items = clone(this.items);
  const isArray = Array.isArray(this.items);
  const prepend = size < 0;

  for (let iterator = 0; iterator < diff;) {
    if (!isArray) {
      if (items[iterator] !== undefined) {
        diff += 1;
      } else {
        items[iterator] = value;
      }
    } else if (prepend) {
      items.unshift(value);
    } else {
      items.push(value);
    }

    iterator += 1;
  }

  return new this.constructor(items);
};

var partition = function partition(fn) {
  let arrays;

  if (Array.isArray(this.items)) {
    arrays = [new this.constructor([]), new this.constructor([])];

    this.items.forEach((item) => {
      if (fn(item) === true) {
        arrays[0].push(item);
      } else {
        arrays[1].push(item);
      }
    });
  } else {
    arrays = [new this.constructor({}), new this.constructor({})];

    Object.keys(this.items).forEach((prop) => {
      const value = this.items[prop];

      if (fn(value) === true) {
        arrays[0].put(prop, value);
      } else {
        arrays[1].put(prop, value);
      }
    });
  }

  return new this.constructor(arrays);
};

var pipe = function pipe(fn) {
  return fn(this);
};

const { isArray: isArray$7, isObject: isObject$8 } = is;
const nestedValue$5 = nestedValue$8;

const buildKeyPathMap = function buildKeyPathMap(items) {
  const keyPaths = {};

  items.forEach((item, index) => {
    function buildKeyPath(val, keyPath) {
      if (isObject$8(val)) {
        Object.keys(val).forEach((prop) => {
          buildKeyPath(val[prop], `${keyPath}.${prop}`);
        });
      } else if (isArray$7(val)) {
        val.forEach((v, i) => {
          buildKeyPath(v, `${keyPath}.${i}`);
        });
      }

      keyPaths[keyPath] = val;
    }

    buildKeyPath(item, index);
  });

  return keyPaths;
};

var pluck = function pluck(value, key) {
  if (value.indexOf('*') !== -1) {
    const keyPathMap = buildKeyPathMap(this.items);

    const keyMatches = [];

    if (key !== undefined) {
      const keyRegex = new RegExp(`0.${key}`, 'g');
      const keyNumberOfLevels = `0.${key}`.split('.').length;

      Object.keys(keyPathMap).forEach((k) => {
        const matchingKey = k.match(keyRegex);

        if (matchingKey) {
          const match = matchingKey[0];

          if (match.split('.').length === keyNumberOfLevels) {
            keyMatches.push(keyPathMap[match]);
          }
        }
      });
    }

    const valueMatches = [];
    const valueRegex = new RegExp(`0.${value}`, 'g');
    const valueNumberOfLevels = `0.${value}`.split('.').length;


    Object.keys(keyPathMap).forEach((k) => {
      const matchingValue = k.match(valueRegex);

      if (matchingValue) {
        const match = matchingValue[0];

        if (match.split('.').length === valueNumberOfLevels) {
          valueMatches.push(keyPathMap[match]);
        }
      }
    });

    if (key !== undefined) {
      const collection = {};

      this.items.forEach((item, index) => {
        collection[keyMatches[index] || ''] = valueMatches;
      });

      return new this.constructor(collection);
    }

    return new this.constructor([valueMatches]);
  }

  if (key !== undefined) {
    const collection = {};

    this.items.forEach((item) => {
      if (nestedValue$5(item, value) !== undefined) {
        collection[item[key] || ''] = nestedValue$5(item, value);
      } else {
        collection[item[key] || ''] = null;
      }
    });

    return new this.constructor(collection);
  }

  return this.map((item) => {
    if (nestedValue$5(item, value) !== undefined) {
      return nestedValue$5(item, value);
    }

    return null;
  });
};

const variadic = variadic$4;

/**
 * Delete keys helper
 *
 * Delete one or multiple keys from an object
 *
 * @param obj
 * @param keys
 * @returns {void}
 */
var deleteKeys$2 = function deleteKeys(obj, ...keys) {
  variadic(keys).forEach((key) => {
    // eslint-disable-next-line
    delete obj[key];
  });
};

const { isArray: isArray$6, isObject: isObject$7 } = is;
const deleteKeys$1 = deleteKeys$2;

var pop = function pop(count = 1) {
  if (this.isEmpty()) {
    return null;
  }

  if (isArray$6(this.items)) {
    if (count === 1) {
      return this.items.pop();
    }

    return new this.constructor(this.items.splice(-count));
  }

  if (isObject$7(this.items)) {
    const keys = Object.keys(this.items);

    if (count === 1) {
      const key = keys[keys.length - 1];
      const last = this.items[key];

      deleteKeys$1(this.items, key);

      return last;
    }

    const poppedKeys = keys.slice(-count);

    const newObject = poppedKeys.reduce((acc, current) => {
      acc[current] = this.items[current];

      return acc;
    }, {});

    deleteKeys$1(this.items, poppedKeys);

    return new this.constructor(newObject);
  }

  return null;
};

var prepend = function prepend(value, key) {
  if (key !== undefined) {
    return this.put(key, value);
  }

  this.items.unshift(value);

  return this;
};

const { isFunction: isFunction$8 } = is;

var pull = function pull(key, defaultValue) {
  let returnValue = this.items[key] || null;

  if (!returnValue && defaultValue !== undefined) {
    if (isFunction$8(defaultValue)) {
      returnValue = defaultValue();
    } else {
      returnValue = defaultValue;
    }
  }

  delete this.items[key];

  return returnValue;
};

var push = function push(...items) {
  this.items.push(...items);

  return this;
};

var put = function put(key, value) {
  this.items[key] = value;

  return this;
};

const values$4 = values$8;

var random = function random(length = null) {
  const items = values$4(this.items);

  const collection = new this.constructor(items).shuffle();

  // If not a length was specified
  if (length !== parseInt(length, 10)) {
    return collection.first();
  }

  return collection.take(length);
};

var reduce = function reduce(fn, carry) {
  let reduceCarry = null;

  if (carry !== undefined) {
    reduceCarry = carry;
  }

  if (Array.isArray(this.items)) {
    this.items.forEach((item) => {
      reduceCarry = fn(reduceCarry, item);
    });
  } else {
    Object.keys(this.items).forEach((key) => {
      reduceCarry = fn(reduceCarry, this.items[key], key);
    });
  }

  return reduceCarry;
};

var reject = function reject(fn) {
  return new this.constructor(this.items).filter(item => !fn(item));
};

var replace = function replace(items) {
  if (!items) {
    return this;
  }

  if (Array.isArray(items)) {
    const replaced = this.items.map((value, index) => items[index] || value);

    return new this.constructor(replaced);
  }

  if (items.constructor.name === 'Collection') {
    const replaced = Object.assign({}, this.items, items.all());

    return new this.constructor(replaced);
  }

  const replaced = Object.assign({}, this.items, items);

  return new this.constructor(replaced);
};

var replaceRecursive = function replaceRecursive(items) {
  const replace = (target, source) => {
    const replaced = Object.assign({}, target);

    const mergedKeys = Object.keys(Object.assign({}, target, source));

    mergedKeys.forEach((key) => {
      if (!Array.isArray(source[key]) && typeof source[key] === 'object') {
        replaced[key] = replace(target[key], source[key]);
      } else if (target[key] === undefined && source[key] !== undefined) {
        if (typeof target[key] === 'object') {
          replaced[key] = Object.assign({}, source[key]);
        } else {
          replaced[key] = source[key];
        }
      } else if (target[key] !== undefined && source[key] === undefined) {
        if (typeof target[key] === 'object') {
          replaced[key] = Object.assign({}, target[key]);
        } else {
          replaced[key] = target[key];
        }
      } else if (target[key] !== undefined && source[key] !== undefined) {
        if (typeof source[key] === 'object') {
          replaced[key] = Object.assign({}, source[key]);
        } else {
          replaced[key] = source[key];
        }
      }
    });

    return replaced;
  };

  if (!items) {
    return this;
  }

  if (!Array.isArray(items) && typeof items !== 'object') {
    return new this.constructor(replace(this.items, [items]));
  }

  if (items.constructor.name === 'Collection') {
    return new this.constructor(replace(this.items, items.all()));
  }

  return new this.constructor(replace(this.items, items));
};

var reverse = function reverse() {
  const collection = [].concat(this.items).reverse();

  return new this.constructor(collection);
};

/* eslint-disable eqeqeq */

const { isArray: isArray$5, isObject: isObject$6, isFunction: isFunction$7 } = is;

var search = function search(valueOrFunction, strict) {
  let result;

  const find = (item, key) => {
    if (isFunction$7(valueOrFunction)) {
      return valueOrFunction(this.items[key], key);
    }

    if (strict) {
      return this.items[key] === valueOrFunction;
    }

    return this.items[key] == valueOrFunction;
  };

  if (isArray$5(this.items)) {
    result = this.items.findIndex(find);
  } else if (isObject$6(this.items)) {
    result = Object.keys(this.items).find(key => find(this.items[key], key));
  }

  if (result === undefined || result < 0) {
    return false;
  }

  return result;
};

const { isArray: isArray$4, isObject: isObject$5 } = is;
const deleteKeys = deleteKeys$2;

var shift = function shift(count = 1) {
  if (this.isEmpty()) {
    return null;
  }

  if (isArray$4(this.items)) {
    if (count === 1) {
      return this.items.shift();
    }

    return new this.constructor(this.items.splice(0, count));
  }

  if (isObject$5(this.items)) {
    if (count === 1) {
      const key = Object.keys(this.items)[0];
      const value = this.items[key];
      delete this.items[key];

      return value;
    }

    const keys = Object.keys(this.items);
    const poppedKeys = keys.slice(0, count);

    const newObject = poppedKeys.reduce((acc, current) => {
      acc[current] = this.items[current];

      return acc;
    }, {});

    deleteKeys(this.items, poppedKeys);

    return new this.constructor(newObject);
  }

  return null;
};

const values$3 = values$8;

var shuffle = function shuffle() {
  const items = values$3(this.items);

  let j;
  let x;
  let i;

  for (i = items.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = items[i - 1];
    items[i - 1] = items[j];
    items[j] = x;
  }

  this.items = items;

  return this;
};

const { isObject: isObject$4 } = is;

var skip = function skip(number) {
  if (isObject$4(this.items)) {
    return new this.constructor(
      Object.keys(this.items)
        .reduce((accumulator, key, index) => {
          if ((index + 1) > number) {
            accumulator[key] = this.items[key];
          }

          return accumulator;
        }, {}),
    );
  }

  return new this.constructor(this.items.slice(number));
};

const { isArray: isArray$3, isObject: isObject$3, isFunction: isFunction$6 } = is;

var skipUntil = function skipUntil(valueOrFunction) {
  let previous = null;
  let items;

  let callback = value => value === valueOrFunction;
  if (isFunction$6(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$3(this.items)) {
    items = this.items.filter((item) => {
      if (previous !== true) {
        previous = callback(item);
      }

      return previous;
    });
  }

  if (isObject$3(this.items)) {
    items = Object.keys(this.items).reduce((acc, key) => {
      if (previous !== true) {
        previous = callback(this.items[key]);
      }

      if (previous !== false) {
        acc[key] = this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

const { isArray: isArray$2, isObject: isObject$2, isFunction: isFunction$5 } = is;

var skipWhile = function skipWhile(valueOrFunction) {
  let previous = null;
  let items;

  let callback = value => value === valueOrFunction;
  if (isFunction$5(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$2(this.items)) {
    items = this.items.filter((item) => {
      if (previous !== true) {
        previous = !callback(item);
      }

      return previous;
    });
  }

  if (isObject$2(this.items)) {
    items = Object.keys(this.items).reduce((acc, key) => {
      if (previous !== true) {
        previous = !callback(this.items[key]);
      }

      if (previous !== false) {
        acc[key] = this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var slice = function slice(remove, limit) {
  let collection = this.items.slice(remove);

  if (limit !== undefined) {
    collection = collection.slice(0, limit);
  }

  return new this.constructor(collection);
};

const contains = contains$1;

var some = contains;

var sort = function sort(fn) {
  const collection = [].concat(this.items);

  if (fn === undefined) {
    if (this.every(item => typeof item === 'number')) {
      collection.sort((a, b) => a - b);
    } else {
      collection.sort();
    }
  } else {
    collection.sort(fn);
  }

  return new this.constructor(collection);
};

var sortDesc = function sortDesc() {
  return this.sort().reverse();
};

const nestedValue$4 = nestedValue$8;
const { isFunction: isFunction$4 } = is;

var sortBy = function sortBy(valueOrFunction) {
  const collection = [].concat(this.items);
  const getValue = (item) => {
    if (isFunction$4(valueOrFunction)) {
      return valueOrFunction(item);
    }

    return nestedValue$4(item, valueOrFunction);
  };

  collection.sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (valueA === null || valueA === undefined) {
      return 1;
    }
    if (valueB === null || valueB === undefined) {
      return -1;
    }

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }

    return 0;
  });

  return new this.constructor(collection);
};

var sortByDesc = function sortByDesc(valueOrFunction) {
  return this.sortBy(valueOrFunction).reverse();
};

var sortKeys = function sortKeys() {
  const ordered = {};

  Object.keys(this.items).sort().forEach((key) => {
    ordered[key] = this.items[key];
  });

  return new this.constructor(ordered);
};

var sortKeysDesc = function sortKeysDesc() {
  const ordered = {};

  Object.keys(this.items).sort().reverse().forEach((key) => {
    ordered[key] = this.items[key];
  });

  return new this.constructor(ordered);
};

var splice = function splice(index, limit, replace) {
  const slicedCollection = this.slice(index, limit);

  this.items = this.diff(slicedCollection.all()).all();

  if (Array.isArray(replace)) {
    for (let iterator = 0, { length } = replace;
      iterator < length; iterator += 1) {
      this.items.splice(index + iterator, 0, replace[iterator]);
    }
  }

  return slicedCollection;
};

var split = function split(numberOfGroups) {
  const itemsPerGroup = Math.round(this.items.length / numberOfGroups);

  const items = JSON.parse(JSON.stringify(this.items));
  const collection = [];

  for (let iterator = 0; iterator < numberOfGroups; iterator += 1) {
    collection.push(new this.constructor(items.splice(0, itemsPerGroup)));
  }

  return new this.constructor(collection);
};

const values$2 = values$8;
const { isFunction: isFunction$3 } = is;

var sum = function sum(key) {
  const items = values$2(this.items);

  let total = 0;

  if (key === undefined) {
    for (let i = 0, { length } = items; i < length; i += 1) {
      total += parseFloat(items[i]);
    }
  } else if (isFunction$3(key)) {
    for (let i = 0, { length } = items; i < length; i += 1) {
      total += parseFloat(key(items[i]));
    }
  } else {
    for (let i = 0, { length } = items; i < length; i += 1) {
      total += parseFloat(items[i][key]);
    }
  }


  return parseFloat(total.toPrecision(12));
};

var take = function take(length) {
  if (!Array.isArray(this.items) && typeof this.items === 'object') {
    const keys = Object.keys(this.items);
    let slicedKeys;

    if (length < 0) {
      slicedKeys = keys.slice(length);
    } else {
      slicedKeys = keys.slice(0, length);
    }

    const collection = {};

    keys.forEach((prop) => {
      if (slicedKeys.indexOf(prop) !== -1) {
        collection[prop] = this.items[prop];
      }
    });

    return new this.constructor(collection);
  }

  if (length < 0) {
    return new this.constructor(this.items.slice(length));
  }

  return new this.constructor(this.items.slice(0, length));
};

const { isArray: isArray$1, isObject: isObject$1, isFunction: isFunction$2 } = is;

var takeUntil = function takeUntil(valueOrFunction) {
  let previous = null;
  let items;

  let callback = value => value === valueOrFunction;
  if (isFunction$2(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray$1(this.items)) {
    items = this.items.filter((item) => {
      if (previous !== false) {
        previous = !callback(item);
      }

      return previous;
    });
  }

  if (isObject$1(this.items)) {
    items = Object.keys(this.items).reduce((acc, key) => {
      if (previous !== false) {
        previous = !callback(this.items[key]);
      }

      if (previous !== false) {
        acc[key] = this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

const { isArray, isObject, isFunction: isFunction$1 } = is;

var takeWhile = function takeWhile(valueOrFunction) {
  let previous = null;
  let items;

  let callback = value => value === valueOrFunction;
  if (isFunction$1(valueOrFunction)) {
    callback = valueOrFunction;
  }

  if (isArray(this.items)) {
    items = this.items.filter((item) => {
      if (previous !== false) {
        previous = callback(item);
      }

      return previous;
    });
  }

  if (isObject(this.items)) {
    items = Object.keys(this.items).reduce((acc, key) => {
      if (previous !== false) {
        previous = callback(this.items[key]);
      }

      if (previous !== false) {
        acc[key] = this.items[key];
      }

      return acc;
    }, {});
  }

  return new this.constructor(items);
};

var tap = function tap(fn) {
  fn(this);

  return this;
};

var times = function times(n, fn) {
  for (let iterator = 1; iterator <= n; iterator += 1) {
    this.items.push(fn(iterator));
  }

  return this;
};

var toArray = function toArray() {
  const collectionInstance = this.constructor;

  function iterate(list, collection) {
    const childCollection = [];

    if (list instanceof collectionInstance) {
      list.items.forEach(i => iterate(i, childCollection));
      collection.push(childCollection);
    } else if (Array.isArray(list)) {
      list.forEach(i => iterate(i, childCollection));
      collection.push(childCollection);
    } else {
      collection.push(list);
    }
  }

  if (Array.isArray(this.items)) {
    const collection = [];

    this.items.forEach((items) => {
      iterate(items, collection);
    });

    return collection;
  }

  return this.values().all();
};

var toJson = function toJson() {
  if (typeof this.items === 'object' && !Array.isArray(this.items)) {
    return JSON.stringify(this.all());
  }

  return JSON.stringify(this.toArray());
};

var transform = function transform(fn) {
  if (Array.isArray(this.items)) {
    this.items = this.items.map(fn);
  } else {
    const collection = {};

    Object.keys(this.items).forEach((key) => {
      collection[key] = fn(this.items[key], key);
    });

    this.items = collection;
  }

  return this;
};

var unless = function when(value, fn, defaultFn) {
  if (!value) {
    fn(this);
  } else {
    defaultFn(this);
  }
};

var whenNotEmpty = function whenNotEmpty(fn, defaultFn) {
  if (Array.isArray(this.items) && this.items.length) {
    return fn(this);
  } if (Object.keys(this.items).length) {
    return fn(this);
  }

  if (defaultFn !== undefined) {
    if (Array.isArray(this.items) && !this.items.length) {
      return defaultFn(this);
    } if (!Object.keys(this.items).length) {
      return defaultFn(this);
    }
  }

  return this;
};

var whenEmpty = function whenEmpty(fn, defaultFn) {
  if (Array.isArray(this.items) && !this.items.length) {
    return fn(this);
  } if (!Object.keys(this.items).length) {
    return fn(this);
  }

  if (defaultFn !== undefined) {
    if (Array.isArray(this.items) && this.items.length) {
      return defaultFn(this);
    } if (Object.keys(this.items).length) {
      return defaultFn(this);
    }
  }

  return this;
};

var union = function union(object) {
  const collection = JSON.parse(JSON.stringify(this.items));

  Object.keys(object).forEach((prop) => {
    if (this.items[prop] === undefined) {
      collection[prop] = object[prop];
    }
  });

  return new this.constructor(collection);
};

const { isFunction } = is;

var unique = function unique(key) {
  let collection;

  if (key === undefined) {
    collection = this.items
      .filter((element, index, self) => self.indexOf(element) === index);
  } else {
    collection = [];

    const usedKeys = [];

    for (let iterator = 0, { length } = this.items;
      iterator < length; iterator += 1) {
      let uniqueKey;
      if (isFunction(key)) {
        uniqueKey = key(this.items[iterator]);
      } else {
        uniqueKey = this.items[iterator][key];
      }

      if (usedKeys.indexOf(uniqueKey) === -1) {
        collection.push(this.items[iterator]);
        usedKeys.push(uniqueKey);
      }
    }
  }

  return new this.constructor(collection);
};

var unwrap = function unwrap(value) {
  if (value instanceof this.constructor) {
    return value.all();
  }

  return value;
};

const getValues = values$8;

var values$1 = function values() {
  return new this.constructor(getValues(this.items));
};

var when = function when(value, fn, defaultFn) {
  if (value) {
    return fn(this, value);
  }

  if (defaultFn) {
    return defaultFn(this, value);
  }

  return this;
};

const values = values$8;
const nestedValue$3 = nestedValue$8;

var where = function where(key, operator, value) {
  let comparisonOperator = operator;
  let comparisonValue = value;

  const items = values(this.items);

  if (operator === undefined || operator === true) {
    return new this.constructor(items.filter(item => nestedValue$3(item, key)));
  }

  if (operator === false) {
    return new this.constructor(items.filter(item => !nestedValue$3(item, key)));
  }

  if (value === undefined) {
    comparisonValue = operator;
    comparisonOperator = '===';
  }

  const collection = items.filter((item) => {
    switch (comparisonOperator) {
      case '==':
        return nestedValue$3(item, key) === Number(comparisonValue)
          || nestedValue$3(item, key) === comparisonValue.toString();

      default:
      case '===':
        return nestedValue$3(item, key) === comparisonValue;

      case '!=':
      case '<>':
        return nestedValue$3(item, key) !== Number(comparisonValue)
          && nestedValue$3(item, key) !== comparisonValue.toString();

      case '!==':
        return nestedValue$3(item, key) !== comparisonValue;

      case '<':
        return nestedValue$3(item, key) < comparisonValue;

      case '<=':
        return nestedValue$3(item, key) <= comparisonValue;

      case '>':
        return nestedValue$3(item, key) > comparisonValue;

      case '>=':
        return nestedValue$3(item, key) >= comparisonValue;
    }
  });

  return new this.constructor(collection);
};

var whereBetween = function whereBetween(key, values) {
  return this.where(key, '>=', values[0]).where(key, '<=', values[values.length - 1]);
};

const extractValues$1 = values$8;
const nestedValue$2 = nestedValue$8;

var whereIn = function whereIn(key, values) {
  const items = extractValues$1(values);

  const collection = this.items
    .filter(item => items.indexOf(nestedValue$2(item, key)) !== -1);

  return new this.constructor(collection);
};

var whereInstanceOf = function whereInstanceOf(type) {
  return this.filter(item => item instanceof type);
};

const nestedValue$1 = nestedValue$8;

var whereNotBetween = function whereNotBetween(key, values) {
  return this.filter(item => (
    nestedValue$1(item, key) < values[0] || nestedValue$1(item, key) > values[values.length - 1]
  ));
};

const extractValues = values$8;
const nestedValue = nestedValue$8;

var whereNotIn = function whereNotIn(key, values) {
  const items = extractValues(values);

  const collection = this.items
    .filter(item => items.indexOf(nestedValue(item, key)) === -1);

  return new this.constructor(collection);
};

var whereNull = function whereNull(key = null) {
  return this.where(key, '===', null);
};

var whereNotNull = function whereNotNull(key = null) {
  return this.where(key, '!==', null);
};

var wrap = function wrap(value) {
  if (value instanceof this.constructor) {
    return value;
  }

  if (typeof value === 'object') {
    return new this.constructor(value);
  }

  return new this.constructor([value]);
};

var zip = function zip(array) {
  let values = array;

  if (values instanceof this.constructor) {
    values = values.all();
  }

  const collection = this.items.map((item, index) => new this.constructor([item, values[index]]));

  return new this.constructor(collection);
};

function Collection(collection) {
  if (collection !== undefined && !Array.isArray(collection) && typeof collection !== 'object') {
    this.items = [collection];
  } else if (collection instanceof this.constructor) {
    this.items = collection.all();
  } else {
    this.items = collection || [];
  }
}

/**
 * Symbol.iterator
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
 */
const SymbolIterator = symbol_iterator;

if (typeof Symbol !== 'undefined') {
  Collection.prototype[Symbol.iterator] = SymbolIterator;
}

/**
 * Support JSON.stringify
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
Collection.prototype.toJSON = function toJSON() {
  return this.items;
};

Collection.prototype.all = all;
Collection.prototype.average = average$1;
Collection.prototype.avg = avg;
Collection.prototype.chunk = chunk;
Collection.prototype.collapse = collapse;
Collection.prototype.combine = combine;
Collection.prototype.concat = concat;
Collection.prototype.contains = contains$1;
Collection.prototype.count = count;
Collection.prototype.countBy = countBy;
Collection.prototype.crossJoin = crossJoin;
Collection.prototype.dd = dd;
Collection.prototype.diff = diff;
Collection.prototype.diffAssoc = diffAssoc;
Collection.prototype.diffKeys = diffKeys;
Collection.prototype.dump = dump;
Collection.prototype.duplicates = duplicates;
Collection.prototype.each = each;
Collection.prototype.eachSpread = eachSpread;
Collection.prototype.every = every;
Collection.prototype.except = except;
Collection.prototype.filter = filter;
Collection.prototype.first = first;
Collection.prototype.firstWhere = firstWhere;
Collection.prototype.flatMap = flatMap;
Collection.prototype.flatten = flatten;
Collection.prototype.flip = flip;
Collection.prototype.forPage = forPage;
Collection.prototype.forget = forget;
Collection.prototype.get = get;
Collection.prototype.groupBy = groupBy;
Collection.prototype.has = has;
Collection.prototype.implode = implode;
Collection.prototype.intersect = intersect;
Collection.prototype.intersectByKeys = intersectByKeys;
Collection.prototype.isEmpty = isEmpty;
Collection.prototype.isNotEmpty = isNotEmpty;
Collection.prototype.join = join;
Collection.prototype.keyBy = keyBy;
Collection.prototype.keys = keys;
Collection.prototype.last = last;
Collection.prototype.macro = macro;
Collection.prototype.make = make;
Collection.prototype.map = map;
Collection.prototype.mapSpread = mapSpread;
Collection.prototype.mapToDictionary = mapToDictionary;
Collection.prototype.mapInto = mapInto;
Collection.prototype.mapToGroups = mapToGroups;
Collection.prototype.mapWithKeys = mapWithKeys;
Collection.prototype.max = max;
Collection.prototype.median = median;
Collection.prototype.merge = merge;
Collection.prototype.mergeRecursive = mergeRecursive;
Collection.prototype.min = min;
Collection.prototype.mode = mode;
Collection.prototype.nth = nth;
Collection.prototype.only = only;
Collection.prototype.pad = pad;
Collection.prototype.partition = partition;
Collection.prototype.pipe = pipe;
Collection.prototype.pluck = pluck;
Collection.prototype.pop = pop;
Collection.prototype.prepend = prepend;
Collection.prototype.pull = pull;
Collection.prototype.push = push;
Collection.prototype.put = put;
Collection.prototype.random = random;
Collection.prototype.reduce = reduce;
Collection.prototype.reject = reject;
Collection.prototype.replace = replace;
Collection.prototype.replaceRecursive = replaceRecursive;
Collection.prototype.reverse = reverse;
Collection.prototype.search = search;
Collection.prototype.shift = shift;
Collection.prototype.shuffle = shuffle;
Collection.prototype.skip = skip;
Collection.prototype.skipUntil = skipUntil;
Collection.prototype.skipWhile = skipWhile;
Collection.prototype.slice = slice;
Collection.prototype.some = some;
Collection.prototype.sort = sort;
Collection.prototype.sortDesc = sortDesc;
Collection.prototype.sortBy = sortBy;
Collection.prototype.sortByDesc = sortByDesc;
Collection.prototype.sortKeys = sortKeys;
Collection.prototype.sortKeysDesc = sortKeysDesc;
Collection.prototype.splice = splice;
Collection.prototype.split = split;
Collection.prototype.sum = sum;
Collection.prototype.take = take;
Collection.prototype.takeUntil = takeUntil;
Collection.prototype.takeWhile = takeWhile;
Collection.prototype.tap = tap;
Collection.prototype.times = times;
Collection.prototype.toArray = toArray;
Collection.prototype.toJson = toJson;
Collection.prototype.transform = transform;
Collection.prototype.unless = unless;
Collection.prototype.unlessEmpty = whenNotEmpty;
Collection.prototype.unlessNotEmpty = whenEmpty;
Collection.prototype.union = union;
Collection.prototype.unique = unique;
Collection.prototype.unwrap = unwrap;
Collection.prototype.values = values$1;
Collection.prototype.when = when;
Collection.prototype.whenEmpty = whenEmpty;
Collection.prototype.whenNotEmpty = whenNotEmpty;
Collection.prototype.where = where;
Collection.prototype.whereBetween = whereBetween;
Collection.prototype.whereIn = whereIn;
Collection.prototype.whereInstanceOf = whereInstanceOf;
Collection.prototype.whereNotBetween = whereNotBetween;
Collection.prototype.whereNotIn = whereNotIn;
Collection.prototype.whereNull = whereNull;
Collection.prototype.whereNotNull = whereNotNull;
Collection.prototype.wrap = wrap;
Collection.prototype.zip = zip;

const collect = collection => new Collection(collection);

src.exports = collect;
var collect_1 = src.exports.collect = collect;
src.exports.default = collect;
src.exports.Collection = Collection;

export { collect_1 as default };

const fs = require('fs');
const zlib = require('zlib');
const { join } = require('path');
const { inspect } = require('util');
const { CLDRFramework } = require('@phensley/cldr');

exports.dump = (o) => inspect(o, true, undefined, true);

const framework = new CLDRFramework({
  loader: (lang) => {
    const path = join(__dirname, `node_modules/@phensley/cldr/packs/${lang}.json.gz`);
      const compressed = fs.readFileSync(path);
      return zlib.gunzipSync(compressed).toString('utf-8');
  }
});

// Use our lib to format numbers for display
const cldr = framework.get('en');

// const MEGABYTE = 1024 * 1024;
// const KILOBYTE = 1024;

// exports.datasize = (n) => {
//   if (n >= MEGABYTE) {
//     n /= MEGABYTE;
//     unit = 'megabyte';
//   } else if (n >= KILOBYTE) {
//     n /= KILOBYTE;
//     unit = 'kilobyte';
//   } else {
//     unit = 'byte';
//   }
//   return cldr.Units.formatQuantity(
//     { value: n, unit }, { length: 'short', minimumFractionDigits: 2});
// };

exports.decimal = (n) => cldr.Numbers.formatDecimal(n);
